"""
DigiSoft Nexus — Phase 7 Migration
backend/integrations/migrations/0001_initial.py

Creates all integration tracking tables.
Run: python manage.py migrate integrations
"""

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('api', '0001_initial'),  # Phase 2 Lead model
    ]

    operations = [
        migrations.CreateModel(
            name='LeadIntegrationRecord',
            fields=[
                ('id',             models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lead',           models.ForeignKey('api.Lead', on_delete=django.db.models.deletion.CASCADE, related_name='integrations')),
                ('platform',       models.CharField(choices=[('hubspot','HubSpot'),('zoho','Zoho CRM'),('whatsapp','WhatsApp Business'),('meta','Meta Conversions'),('ga4','Google Analytics 4'),('slack','Slack')], max_length=20)),
                ('external_id',    models.CharField(blank=True, max_length=255, null=True)),
                ('status',         models.CharField(choices=[('pending','Pending'),('success','Success'),('failed','Failed'),('skipped','Skipped')], default='pending', max_length=20)),
                ('last_synced_at', models.DateTimeField(blank=True, null=True)),
                ('error_message',  models.TextField(blank=True, null=True)),
                ('sync_count',     models.PositiveIntegerField(default=0)),
                ('created_at',     models.DateTimeField(auto_now_add=True)),
                ('updated_at',     models.DateTimeField(auto_now=True)),
            ],
            options={'verbose_name': 'Lead Integration Record'},
        ),
        migrations.CreateModel(
            name='FailedIntegrationLog',
            fields=[
                ('id',            models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lead',          models.ForeignKey('api.Lead', on_delete=django.db.models.deletion.CASCADE, related_name='failed_integrations')),
                ('platform',      models.CharField(choices=[('hubspot','HubSpot'),('zoho','Zoho CRM'),('whatsapp','WhatsApp Business'),('meta','Meta Conversions'),('ga4','Google Analytics 4'),('slack','Slack')], max_length=20)),
                ('task_name',     models.CharField(max_length=200)),
                ('task_kwargs',   models.JSONField(default=dict)),
                ('error_message', models.TextField()),
                ('attempts',      models.PositiveSmallIntegerField(default=3)),
                ('resolved',      models.BooleanField(default=False)),
                ('created_at',    models.DateTimeField(auto_now_add=True)),
            ],
            options={'ordering': ['-created_at'], 'verbose_name': 'Failed Integration Log'},
        ),
        migrations.CreateModel(
            name='ZohoTokenCache',
            fields=[
                ('id',           models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('access_token', models.TextField()),
                ('expires_at',   models.DateTimeField()),
                ('updated_at',   models.DateTimeField(auto_now=True)),
            ],
            options={'verbose_name': 'Zoho Token Cache'},
        ),
        migrations.CreateModel(
            name='WhatsAppMessageLog',
            fields=[
                ('id',            models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lead',          models.ForeignKey('api.Lead', on_delete=django.db.models.deletion.CASCADE, related_name='whatsapp_messages')),
                ('message_type',  models.CharField(choices=[('welcome','Welcome'),('followup','Follow-up'),('sitevisit','Site Visit Confirm'),('win','Deal Won'),('brochure','Brochure'),('manual','Manual (by agent)')], max_length=20)),
                ('template_name', models.CharField(blank=True, max_length=100)),
                ('wa_message_id', models.CharField(blank=True, max_length=255, null=True)),
                ('status',        models.CharField(default='sent', max_length=20)),
                ('sent_at',       models.DateTimeField(auto_now_add=True)),
                ('error',         models.TextField(blank=True, null=True)),
            ],
            options={'ordering': ['-sent_at']},
        ),
        migrations.AddIndex(
            model_name='leadintegrationrecord',
            index=models.Index(fields=['platform', 'status'], name='integration_platform_status_idx'),
        ),
        migrations.AddIndex(
            model_name='leadintegrationrecord',
            index=models.Index(fields=['lead', 'platform'], name='integration_lead_platform_idx'),
        ),
        migrations.AddConstraint(
            model_name='leadintegrationrecord',
            constraint=models.UniqueConstraint(fields=['lead', 'platform'], name='unique_lead_platform'),
        ),
    ]
