"""
DigiSoft Nexus — Phase 7 Integration Tests
backend/integrations/tests/test_integrations.py

Tests cover:
  - HubSpot client (mocked API calls)
  - Zoho client (mocked OAuth + API)
  - WhatsApp client (mocked Meta API)
  - Meta CAPI (mocked conversion events)
  - Celery tasks (unit tests with eager execution)
  - Webhook signature verification
  - Lead capture signal chain
  - Rate limiting and deduplication

Run: python manage.py test integrations.tests
"""

import json
import hashlib
import hmac
import time
from unittest.mock import patch, MagicMock, call
from django.test import TestCase, RequestFactory
from django.utils import timezone


# ─── Fixtures ────────────────────────────────────────────────────

def make_lead(**kwargs):
    """Create a minimal mock Lead object for testing."""
    lead = MagicMock()
    lead.id = kwargs.get('id', 42)
    lead.first_name = kwargs.get('first_name', 'Test')
    lead.last_name  = kwargs.get('last_name', 'User')
    lead.phone      = kwargs.get('phone', '+919876543210')
    lead.email      = kwargs.get('email', 'test@example.com')
    lead.status     = kwargs.get('status', 'new')
    lead.source     = kwargs.get('source', 'google-ads')
    lead.score      = kwargs.get('score', 65)
    lead.profile_stage = kwargs.get('profile_stage', 2)
    lead.property_interest = kwargs.get('property_interest', 'Godrej Emerald')
    lead.property_slug     = kwargs.get('property_slug', 'godrej-emerald')
    lead.budget     = kwargs.get('budget', '₹1 Cr – ₹2 Cr')
    lead.current_city = kwargs.get('current_city', 'Delhi')
    lead.utm_source = kwargs.get('utm_source', 'google')
    lead.utm_medium = kwargs.get('utm_medium', 'cpc')
    lead.utm_campaign = kwargs.get('utm_campaign', 'godrej-emerald-feb')
    lead.page_url   = kwargs.get('page_url', 'https://digisoftnexus.com')
    return lead


# ─── HubSpot Tests ───────────────────────────────────────────────

class HubSpotClientTests(TestCase):

    @patch('integrations.hubspot_client.requests.post')
    def test_find_contact_not_found(self, mock_post):
        """Should return None when no contact matches phone."""
        from integrations.hubspot_client import find_contact_by_phone
        mock_post.return_value.json.return_value = {'results': []}
        mock_post.return_value.raise_for_status = MagicMock()

        result = find_contact_by_phone('+919876543210')
        self.assertIsNone(result)

    @patch('integrations.hubspot_client.requests.post')
    def test_find_contact_found(self, mock_post):
        """Should return contact ID when phone matches."""
        from integrations.hubspot_client import find_contact_by_phone
        mock_post.return_value.json.return_value = {'results': [{'id': 'hs123'}]}
        mock_post.return_value.raise_for_status = MagicMock()

        result = find_contact_by_phone('+919876543210')
        self.assertEqual(result, 'hs123')

    @patch('integrations.hubspot_client.find_contact_by_phone', return_value=None)
    @patch('integrations.hubspot_client.requests.post')
    def test_create_contact_new(self, mock_post, mock_find):
        """Should create new contact when phone not found."""
        from integrations.hubspot_client import create_or_update_contact
        mock_post.return_value.json.return_value = {'id': 'hs456'}
        mock_post.return_value.raise_for_status = MagicMock()

        lead = make_lead()
        result = create_or_update_contact(lead)
        self.assertEqual(result, 'hs456')
        mock_post.assert_called_once()

    @patch('integrations.hubspot_client.find_contact_by_phone', return_value='hs123')
    @patch('integrations.hubspot_client.requests.patch')
    def test_update_contact_existing(self, mock_patch, mock_find):
        """Should PATCH existing contact instead of creating duplicate."""
        from integrations.hubspot_client import create_or_update_contact
        mock_patch.return_value.json.return_value = {'id': 'hs123'}
        mock_patch.return_value.raise_for_status = MagicMock()

        lead = make_lead()
        result = create_or_update_contact(lead)
        self.assertEqual(result, 'hs123')
        mock_patch.assert_called_once()

    def test_stage_mapping_complete(self):
        """All DigiSoft statuses must map to a HubSpot stage."""
        from integrations.hubspot_client import STAGE_MAP
        statuses = ['new', 'contacted', 'site-visit', 'negotiation', 'closed-won', 'closed-lost']
        for s in statuses:
            self.assertIn(s, STAGE_MAP, f'Missing HubSpot stage mapping for status: {s}')

    def test_webhook_signature_valid(self):
        """Should accept requests with valid HMAC signature."""
        from integrations.hubspot_client import verify_hubspot_signature
        from django.conf import settings

        body = b'{"test": "payload"}'
        secret = getattr(settings, 'HUBSPOT_WEBHOOK_SECRET', 'test-secret')
        sig = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()

        with self.settings(HUBSPOT_WEBHOOK_SECRET=secret):
            self.assertTrue(verify_hubspot_signature(body, sig))

    def test_webhook_signature_invalid(self):
        """Should reject requests with tampered signature."""
        from integrations.hubspot_client import verify_hubspot_signature
        with self.settings(HUBSPOT_WEBHOOK_SECRET='real-secret'):
            self.assertFalse(verify_hubspot_signature(b'body', 'wrong-sig'))

    def test_parse_webhook_stage_change(self):
        """Should extract status transition from HubSpot webhook payload."""
        from integrations.hubspot_client import parse_hubspot_webhook
        payload = [{
            'subscriptionType': 'deal.propertyChange',
            'objectId': 'deal999',
            'propertyName': 'dealstage',
            'propertyValue': 'closedwon',
        }]
        events = parse_hubspot_webhook(payload)
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]['new_status'], 'closed-won')


# ─── Zoho Tests ───────────────────────────────────────────────────

class ZohoClientTests(TestCase):

    @patch('integrations.zoho_client.requests.get')
    def test_search_returns_none_when_empty(self, mock_get):
        """204 No Content = no matching lead."""
        from integrations.zoho_client import _search_lead
        mock_get.return_value.status_code = 204

        result = _search_lead('+919876543210')
        self.assertIsNone(result)

    @patch('integrations.zoho_client._search_lead', return_value=None)
    @patch('integrations.zoho_client._post_lead')
    @patch('integrations.zoho_client._get_token', return_value='tok123')
    def test_create_new_zoho_lead(self, mock_tok, mock_post, mock_search):
        """Should create Zoho lead when phone not found."""
        from integrations.zoho_client import create_or_update_lead
        mock_post.return_value = {'data': [{'details': {'id': 'zoho789'}}]}

        lead = make_lead()
        result = create_or_update_lead(lead)
        self.assertEqual(result, 'zoho789')
        mock_post.assert_called_once()

    def test_status_map_complete(self):
        """All DigiSoft statuses must map to a Zoho status."""
        from integrations.zoho_client import ZOHO_STATUS_MAP
        statuses = ['new', 'contacted', 'site-visit', 'negotiation', 'closed-won', 'closed-lost']
        for s in statuses:
            self.assertIn(s, ZOHO_STATUS_MAP)


# ─── WhatsApp Tests ───────────────────────────────────────────────

class WhatsAppClientTests(TestCase):

    def test_clean_phone_10_digit(self):
        """10-digit number should get +91 prefix."""
        from integrations.whatsapp_client import _clean_phone
        self.assertEqual(_clean_phone('+91 98765 43210'), '919876543210')
        self.assertEqual(_clean_phone('9876543210'), '919876543210')

    def test_clean_phone_already_has_country_code(self):
        """E.164 format should pass through unchanged."""
        from integrations.whatsapp_client import _clean_phone
        self.assertEqual(_clean_phone('+919876543210'), '919876543210')

    @patch('integrations.whatsapp_client.requests.post')
    def test_send_welcome_message(self, mock_post):
        """Should POST correct template payload for welcome message."""
        from integrations.whatsapp_client import send_welcome_message
        from django.conf import settings

        mock_post.return_value.json.return_value = {'messages': [{'id': 'wamid.abc123'}]}
        mock_post.return_value.raise_for_status = MagicMock()

        lead = make_lead()
        with patch('integrations.whatsapp_client._log_message') as mock_log:
            send_welcome_message(lead)

        call_kwargs = mock_post.call_args.kwargs['json']
        self.assertEqual(call_kwargs['type'], 'template')
        self.assertEqual(call_kwargs['to'], '919876543210')
        mock_log.assert_called_once()

    def test_verify_webhook_signature(self):
        """Valid HMAC-SHA256 signature should pass verification."""
        from integrations.whatsapp_client import verify_webhook_signature
        from django.conf import settings

        body = b'{"entry": []}'
        token = getattr(settings, 'WA_ACCESS_TOKEN', 'test-token')
        sig = 'sha256=' + hmac.new(token.encode(), body, hashlib.sha256).hexdigest()

        with self.settings(WA_ACCESS_TOKEN=token):
            self.assertTrue(verify_webhook_signature(body, sig))

    def test_parse_status_updates(self):
        """Should extract message status updates from WhatsApp webhook payload."""
        from integrations.whatsapp_client import parse_status_update
        payload = {
            'entry': [{
                'changes': [{
                    'value': {
                        'statuses': [
                            {'id': 'wamid.abc', 'status': 'delivered'},
                            {'id': 'wamid.def', 'status': 'read'},
                        ]
                    }
                }]
            }]
        }
        updates = parse_status_update(payload)
        self.assertEqual(len(updates), 2)
        self.assertEqual(updates[0]['status'], 'delivered')
        self.assertEqual(updates[1]['status'], 'read')


# ─── Meta CAPI Tests ─────────────────────────────────────────────

class MetaCAPITests(TestCase):

    def test_sha256_hashing(self):
        """PII should be consistently hashed."""
        from integrations.meta_client import _sha256
        self.assertEqual(
            _sha256('test@example.com'),
            _sha256('test@example.com'),  # Deterministic
        )
        self.assertNotEqual(_sha256('a@a.com'), _sha256('b@b.com'))

    def test_build_user_data_includes_required_fields(self):
        """User data dict must include phone and country at minimum."""
        from integrations.meta_client import _build_user_data
        lead = make_lead()
        user_data = _build_user_data(lead)
        self.assertIn('ph', user_data)
        self.assertIn('country', user_data)
        self.assertIn('em', user_data)  # Email present in make_lead

    def test_user_data_phone_hashed(self):
        """Phone in user_data must be hashed, not plaintext."""
        from integrations.meta_client import _build_user_data, _sha256
        lead = make_lead(phone='+919876543210')
        user_data = _build_user_data(lead)
        plain_phone = '919876543210'
        self.assertNotIn(plain_phone, str(user_data))  # Not plaintext
        self.assertIn(_sha256(plain_phone), user_data['ph'])

    @patch('integrations.meta_client.requests.post')
    def test_send_lead_event(self, mock_post):
        """Lead event should POST to correct Meta endpoint."""
        from integrations.meta_client import send_lead_event
        mock_post.return_value.json.return_value = {'events_received': 1}
        mock_post.return_value.raise_for_status = MagicMock()

        lead = make_lead()
        result = send_lead_event(lead)

        self.assertEqual(result.get('events_received'), 1)
        payload = mock_post.call_args.kwargs['json']
        self.assertEqual(payload['data'][0]['event_name'], 'Lead')

    @patch('integrations.meta_client.requests.post')
    def test_send_purchase_event(self, mock_post):
        """Purchase event should include revenue and currency."""
        from integrations.meta_client import send_purchase_event
        mock_post.return_value.json.return_value = {'events_received': 1}
        mock_post.return_value.raise_for_status = MagicMock()

        lead = make_lead()
        send_purchase_event(lead, revenue_inr=15_000_000)

        payload = mock_post.call_args.kwargs['json']
        event = payload['data'][0]
        self.assertEqual(event['event_name'], 'Purchase')
        self.assertEqual(event['custom_data']['currency'], 'INR')
        self.assertEqual(event['custom_data']['value'], 15_000_000)


# ─── Lead Capture API Tests ───────────────────────────────────────

class LeadCaptureAPITests(TestCase):

    def setUp(self):
        self.factory = RequestFactory()
        self.valid_payload = {
            'first_name':     'Arjun',
            'last_name':      'Sharma',
            'phone':          '9876543210',
            'email':          'arjun@example.com',
            'property_interest': 'Godrej Emerald',
            'source':         'google-ads',
            'profile_stage':  2,
            'consent_given':  True,
            'consent_text':   'I consent under DPDP Act 2023.',
            'utm_source':     'google',
            'utm_campaign':   'test-campaign',
        }

    def test_capture_serializer_valid(self):
        """Valid payload should pass serializer validation."""
        from api.views_leads import LeadCaptureSerializer
        s = LeadCaptureSerializer(data=self.valid_payload)
        self.assertTrue(s.is_valid(), s.errors)

    def test_capture_serializer_rejects_no_consent(self):
        """Consent required — reject if False."""
        from api.views_leads import LeadCaptureSerializer
        data = {**self.valid_payload, 'consent_given': False}
        s = LeadCaptureSerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn('consent_given', s.errors)

    def test_capture_serializer_normalises_phone(self):
        """10-digit phone should be normalised to E.164."""
        from api.views_leads import LeadCaptureSerializer
        s = LeadCaptureSerializer(data=self.valid_payload)
        s.is_valid()
        self.assertEqual(s.validated_data['phone'], '+919876543210')

    def test_score_calculation_high_intent(self):
        """High-intent signals should produce higher scores."""
        from api.views_leads import _calculate_score
        data = {
            'email': 'test@example.com',
            'property_interest': 'Godrej Emerald',
            'preferred_config': '3BHK',
            'profile_stage': 4,
            'source': 'referral',
            'utm_campaign': 'campaign',
        }
        score = _calculate_score(data)
        self.assertGreater(score, 60)

    def test_score_calculation_low_intent(self):
        """Exit-intent with no profile data should score low."""
        from api.views_leads import _calculate_score
        data = {
            'email': '',
            'property_interest': '',
            'preferred_config': '',
            'profile_stage': 1,
            'source': 'exit-intent',
            'utm_campaign': '',
        }
        score = _calculate_score(data)
        self.assertLess(score, 30)

    def test_rate_limiter(self):
        """Same phone within 1 hour should be rate limited."""
        from api.views_leads import _is_rate_limited
        phone = '+919123456789'
        self.assertFalse(_is_rate_limited(phone))  # First call — not limited
        self.assertTrue(_is_rate_limited(phone))   # Second call — limited


# ─── Webhook View Tests ───────────────────────────────────────────

class WebhookViewTests(TestCase):

    def setUp(self):
        self.factory = RequestFactory()

    def test_whatsapp_webhook_verification(self):
        """GET with correct verify token should return challenge."""
        from webhooks.views import whatsapp_webhook

        request = self.factory.get('/webhooks/whatsapp/', {
            'hub.mode':         'subscribe',
            'hub.verify_token': 'test-verify-token',
            'hub.challenge':    'challenge123',
        })

        with self.settings(WA_VERIFY_TOKEN='test-verify-token'):
            response = whatsapp_webhook(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b'challenge123')

    def test_whatsapp_webhook_wrong_token(self):
        """GET with wrong verify token should return 403."""
        from webhooks.views import whatsapp_webhook

        request = self.factory.get('/webhooks/whatsapp/', {
            'hub.mode':         'subscribe',
            'hub.verify_token': 'wrong-token',
            'hub.challenge':    'challenge123',
        })

        with self.settings(WA_VERIFY_TOKEN='real-token'):
            response = whatsapp_webhook(request)

        self.assertEqual(response.status_code, 403)

    def test_meta_leads_webhook_verification(self):
        """Meta lead ads webhook GET verification."""
        from webhooks.views import meta_leads_webhook

        request = self.factory.get('/webhooks/meta/leads/', {
            'hub.mode':         'subscribe',
            'hub.verify_token': 'verify-token',
            'hub.challenge':    'abc456',
        })

        with self.settings(WA_VERIFY_TOKEN='verify-token'):
            response = meta_leads_webhook(request)

        self.assertEqual(response.status_code, 200)


# ─── Integration Task Tests ───────────────────────────────────────

class CeleryTaskTests(TestCase):
    """Tests for Celery tasks using unittest.mock (no actual Celery required)."""

    @patch('integrations.tasks.push_to_hubspot.delay')
    @patch('integrations.tasks.push_to_zoho.delay')
    @patch('integrations.tasks.send_whatsapp_welcome.delay')
    @patch('integrations.tasks.push_meta_lead_event.delay')
    def test_lead_created_dispatches_all_tasks(self, mock_meta, mock_wa, mock_zoho, mock_hs):
        """Creating a lead should dispatch all 4 primary integration tasks."""
        from integrations.signals import _handle_lead_created
        lead = make_lead()
        _handle_lead_created(lead)

        mock_hs.assert_called_once_with(lead.id)
        mock_zoho.assert_called_once_with(lead.id)
        mock_wa.assert_called_once_with(lead.id)
        mock_meta.assert_called_once_with(lead.id)

    @patch('integrations.tasks.update_hubspot_stage.delay')
    @patch('integrations.tasks.update_zoho_stage.delay')
    @patch('integrations.tasks.send_whatsapp_site_visit.delay')
    @patch('integrations.tasks.push_meta_schedule_event.delay')
    def test_site_visit_status_dispatches_correct_tasks(self, mock_schedule, mock_wa_sv, mock_zoho, mock_hs):
        """Moving to site-visit status should fire CRM updates + WA + Meta schedule."""
        from integrations.signals import _handle_lead_updated
        lead = make_lead(status='site-visit')
        lead._pre_save_status = 'contacted'

        _handle_lead_updated(lead)

        mock_hs.assert_called_once_with(lead.id, 'site-visit')
        mock_zoho.assert_called_once_with(lead.id, 'site-visit')
        mock_wa_sv.assert_called_once_with(lead.id)
        mock_schedule.assert_called_once_with(lead.id)

    @patch('integrations.tasks.update_hubspot_stage.delay')
    @patch('integrations.tasks.update_zoho_stage.delay')
    @patch('integrations.tasks.send_whatsapp_win.delay')
    @patch('integrations.tasks.push_meta_purchase_event.delay')
    def test_closed_won_dispatches_purchase_events(self, mock_purchase, mock_wa_win, mock_zoho, mock_hs):
        """Closing a deal should fire purchase event + win message."""
        from integrations.signals import _handle_lead_updated, _estimate_revenue
        lead = make_lead(status='closed-won', budget='₹1 Cr – ₹2 Cr')
        lead._pre_save_status = 'negotiation'

        _handle_lead_updated(lead)

        expected_revenue = _estimate_revenue('₹1 Cr – ₹2 Cr')
        mock_wa_win.assert_called_once_with(lead.id)
        mock_purchase.assert_called_once_with(lead.id, expected_revenue)

    def test_revenue_estimation(self):
        """Budget ranges should map to correct revenue estimates."""
        from integrations.signals import _estimate_revenue
        self.assertEqual(_estimate_revenue('₹50L – ₹1 Cr'),    7_500_000)
        self.assertEqual(_estimate_revenue('₹1 Cr – ₹2 Cr'),  15_000_000)
        self.assertEqual(_estimate_revenue('₹2 Cr – ₹5 Cr'),  35_000_000)
        self.assertEqual(_estimate_revenue('₹5 Cr – ₹10 Cr'), 75_000_000)
        self.assertEqual(_estimate_revenue(None),              20_000_000)  # Default

    def test_no_tasks_on_same_status(self):
        """No integration tasks should fire if status didn't change."""
        from integrations.signals import _handle_lead_updated
        lead = make_lead(status='contacted')
        lead._pre_save_status = 'contacted'  # Same status

        with patch('integrations.tasks.update_hubspot_stage.delay') as mock_hs:
            _handle_lead_updated(lead)
            mock_hs.assert_not_called()
