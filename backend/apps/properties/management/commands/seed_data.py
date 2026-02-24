"""
management/commands/seed_data.py
Run: python manage.py seed_data
Creates sample developers, properties, campaigns, and blog posts for testing
"""
from django.core.management.base import BaseCommand
from django.utils import timezone


class Command(BaseCommand):
    help = 'Seed database with sample real estate data'

    def handle(self, *args, **kwargs):
        from apps.properties.models import Developer, Property, PropertyImage
        from apps.campaigns.models import AffiliateCampaign
        from apps.blog.models_and_views import BlogCategory, BlogPost

        self.stdout.write('🏠 Seeding DigiSoft Real Estate data...')

        # --- Developers ---
        godrej, _ = Developer.objects.get_or_create(
            slug='godrej-properties',
            defaults={
                'name': 'Godrej Properties',
                'description': 'Award-winning real estate developer known for quality, trust and innovation.',
                'established_year': 1990,
                'website': 'https://www.godrejproperties.com',
                'is_featured': True,
            }
        )
        dlf, _ = Developer.objects.get_or_create(
            slug='dlf',
            defaults={
                'name': 'DLF Limited',
                'description': "India's largest real estate company with 70+ years of experience.",
                'established_year': 1946,
                'website': 'https://www.dlf.in',
                'is_featured': True,
            }
        )
        m3m, _ = Developer.objects.get_or_create(
            slug='m3m',
            defaults={
                'name': 'M3M India',
                'description': 'Fast-growing luxury developer creating world-class integrated townships.',
                'established_year': 2010,
                'website': 'https://www.m3mindia.com',
                'is_featured': True,
            }
        )

        # --- Properties ---
        properties_data = [
            {
                'slug': 'godrej-emerald-sector-89',
                'title': 'Godrej Emerald',
                'developer': godrej,
                'location': 'Sector 89, Gurugram',
                'city': 'Gurugram',
                'sector': 'Sector 89',
                'price_min': 12500000,
                'price_max': 28000000,
                'price_display': '₹1.25 Cr onwards',
                'bhk_options': ['2BHK', '3BHK'],
                'area_min': 1150,
                'area_max': 1850,
                'possession_status': 'new-launch',
                'possession_date': 'Q4 2027',
                'is_featured': True,
                'is_new': True,
                'description': 'Godrej Emerald is a premium residential project offering spacious 2 and 3 BHK apartments in Sector 89, Gurugram. Experience world-class amenities, smart home features, and excellent connectivity to NH-48.',
                'highlights': ['Smart Home Technology', 'Panoramic Views', 'Olympic-size Pool', 'Clubhouse 20,000 sq ft'],
                'amenities': ['Swimming Pool', 'Gymnasium', 'Clubhouse', 'Children\'s Play Area', 'Jogging Track', 'Indoor Games', 'Co-working Space', '24/7 Security'],
                'rera': 'GGM/2024/001',
                'meta_title': 'Godrej Emerald Sector 89 Gurugram | 2-3 BHK Apartments',
                'meta_description': 'Book Godrej Emerald at Sector 89 Gurugram. Premium 2 & 3 BHK apartments from ₹1.25 Cr. Smart home features, world-class amenities.',
            },
            {
                'slug': 'dlf-the-camellias',
                'title': 'DLF The Camellias',
                'developer': dlf,
                'location': 'Golf Course Road, Gurugram',
                'city': 'Gurugram',
                'sector': 'DLF 5',
                'price_min': 120000000,
                'price_max': 300000000,
                'price_display': '₹12 Cr onwards',
                'bhk_options': ['4BHK', '5BHK'],
                'area_min': 5800,
                'area_max': 11000,
                'possession_status': 'ready-to-move',
                'is_featured': True,
                'is_luxury': True,
                'description': 'DLF The Camellias is the pinnacle of ultra-luxury living on Golf Course Road. With sprawling residences, private pools, and butler service, it redefines premium living in India.',
                'highlights': ['Private Plunge Pools', 'Butler Service', 'Concierge 24/7', 'Valet Parking'],
                'amenities': ['Private Pool', 'Butler Service', 'Golf Simulator', 'Spa & Wellness', 'Fine Dining Restaurant', 'Screening Room', 'Wine Cellar'],
                'rera': 'GGM/2023/089',
                'meta_title': 'DLF The Camellias Golf Course Road | Ultra Luxury 4-5 BHK',
                'meta_description': 'DLF The Camellias — India\'s most exclusive ultra-luxury residences on Golf Course Road, Gurugram. 4 & 5 BHK from ₹12 Cr.',
            },
            {
                'slug': 'm3m-altitude-sector-65',
                'title': 'M3M Altitude',
                'developer': m3m,
                'location': 'Sector 65, Gurugram',
                'city': 'Gurugram',
                'sector': 'Sector 65',
                'price_min': 28000000,
                'price_max': 55000000,
                'price_display': '₹2.8 Cr onwards',
                'bhk_options': ['3BHK', '4BHK'],
                'area_min': 2100,
                'area_max': 3200,
                'possession_status': 'under-construction',
                'possession_date': 'Q2 2026',
                'is_featured': True,
                'is_luxury': True,
                'description': 'M3M Altitude offers a premium high-rise living experience in the heart of Gurugram. Strategically located on Golf Course Extension Road, offering excellent connectivity and lifestyle amenities.',
                'highlights': ['High-rise Tower', 'Sky Club on 40th Floor', 'EV Charging Points', 'IGBC Gold Rated'],
                'amenities': ['Sky Club', 'Rooftop Pool', 'Gymnasium', 'Yoga Studio', 'Business Lounge', 'Kids Club'],
                'rera': 'GGM/2024/045',
                'meta_title': 'M3M Altitude Sector 65 Gurugram | Luxury 3-4 BHK Apartments',
                'meta_description': 'M3M Altitude at Sector 65, Gurugram — luxury 3 & 4 BHK high-rise apartments from ₹2.8 Cr. Sky club, rooftop pool.',
            },
            {
                'slug': 'godrej-meridian-sector-106',
                'title': 'Godrej Meridian',
                'developer': godrej,
                'location': 'Sector 106, Gurugram',
                'city': 'Gurugram',
                'sector': 'Sector 106',
                'price_min': 7800000,
                'price_max': 14500000,
                'price_display': '₹78 L onwards',
                'bhk_options': ['2BHK', '3BHK'],
                'area_min': 850,
                'area_max': 1350,
                'possession_status': 'ready-to-move',
                'is_affordable': True,
                'description': 'Godrej Meridian is a ready-to-move residential community in Sector 106, Gurugram. With easy access to Dwarka Expressway and Delhi, it offers excellent connectivity at an affordable price point.',
                'highlights': ['Ready to Move', 'Near Dwarka Expressway', 'RERA Compliant', '100% OC Received'],
                'amenities': ['Swimming Pool', 'Gymnasium', 'Clubhouse', 'Children\'s Play Area', 'Jogging Track'],
                'rera': 'GGM/2021/056',
                'meta_title': 'Godrej Meridian Sector 106 Gurugram | 2-3 BHK Ready to Move',
                'meta_description': 'Godrej Meridian Sector 106 Gurugram — 2 & 3 BHK ready-to-move flats from ₹78 Lakh. Excellent Dwarka Expressway connectivity.',
            },
        ]

        for pd in properties_data:
            prop, created = Property.objects.get_or_create(slug=pd['slug'], defaults=pd)
            if created:
                self.stdout.write(f'  ✅ Property: {prop.title}')

        # --- Campaigns ---
        campaigns_data = [
            {
                'slug': 'godrej-emerald-facebook-may26',
                'campaign_name': 'Godrej Emerald — Facebook CPC May 2026',
                'developer': 'Godrej Properties',
                'property_slug': 'godrej-emerald-sector-89',
                'utm_source': 'facebook',
                'utm_medium': 'cpc',
                'utm_campaign': 'ncr_luxury_may2026',
                'commission_type': 'per_lead',
                'commission_value': 2500,
            },
            {
                'slug': 'dlf-camellias-google-hni',
                'campaign_name': 'DLF Camellias — Google HNI Campaign',
                'developer': 'DLF',
                'property_slug': 'dlf-the-camellias',
                'utm_source': 'google',
                'utm_medium': 'cpc',
                'utm_campaign': 'dlf_ultra_luxury_hni',
                'commission_type': 'percentage',
                'commission_value': 0.5,
            },
        ]

        for cd in campaigns_data:
            from apps.campaigns.models import AffiliateCampaign
            camp, created = AffiliateCampaign.objects.get_or_create(slug=cd['slug'], defaults=cd)
            if created:
                self.stdout.write(f'  ✅ Campaign: {camp.campaign_name}')

        # --- Blog ---
        inv_cat, _ = BlogCategory.objects.get_or_create(slug='investment-guide', defaults={'name': 'Investment Guide'})
        fin_cat, _ = BlogCategory.objects.get_or_create(slug='finance', defaults={'name': 'Finance'})

        blog_posts = [
            {
                'slug': 'gurugram-real-estate-2026-investment-guide',
                'title': 'Gurugram Real Estate 2026: Complete Investment Guide',
                'excerpt': 'Sector-wise price trends, upcoming infrastructure, and why Gurugram remains the top investment destination in North India.',
                'content': '<p>Gurugram has established itself as the premier real estate destination in North India...</p>',
                'featured_image_url': 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
                'featured_image_alt': 'Gurugram skyline real estate investment guide 2026',
                'author_name': 'DigiSoft Research Team',
                'category': inv_cat,
                'tags': ['Gurugram', 'Investment', '2026', 'Real Estate Trends'],
                'is_published': True,
                'is_featured': True,
                'published_at': timezone.now(),
            },
        ]

        for bp in blog_posts:
            post, created = BlogPost.objects.get_or_create(slug=bp['slug'], defaults=bp)
            if created:
                self.stdout.write(f'  ✅ Blog: {post.title}')

        self.stdout.write(self.style.SUCCESS('\n✅ Seeding complete! Run the server now.'))
