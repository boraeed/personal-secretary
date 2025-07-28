import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.company import Company, Reminder, Action, db
from src.models.user import User
from flask import Flask
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(os.path.dirname(__file__), "src", "database", "app.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()
    
    # إضافة شركات تجريبية
    companies_data = [
        {'name': 'شركة الرياض للتجارة', 'commercial_register': '1010123456', 'contact_person': 'أحمد محمد', 'phone': '0501234567', 'email': 'info@riyadh-trade.com', 'status': 'pending'},
        {'name': 'مؤسسة جدة للخدمات', 'commercial_register': '4030987654', 'contact_person': 'فاطمة أحمد', 'phone': '0509876543', 'email': 'contact@jeddah-services.com', 'status': 'inprogress'},
        {'name': 'شركة الدمام للصناعات', 'commercial_register': '2020456789', 'contact_person': 'محمد علي', 'phone': '0506789012', 'email': 'info@dammam-industries.com', 'status': 'completed'}
    ]
    
    for company_data in companies_data:
        if not Company.query.filter_by(commercial_register=company_data['commercial_register']).first():
            company = Company(**company_data)
            db.session.add(company)
    
    db.session.commit()
    
    # إضافة تذكيرات تجريبية
    companies = Company.query.all()
    if companies:
        reminders_data = [
            {'title': 'مكالمة متابعة', 'description': 'متابعة حالة الطلب', 'reminder_type': 'call', 'reminder_date': datetime.now() + timedelta(days=1), 'company_id': companies[0].id},
            {'title': 'مراجعة الوثائق', 'description': 'مراجعة الوثائق المطلوبة', 'reminder_type': 'review', 'reminder_date': datetime.now() + timedelta(days=3), 'company_id': companies[1].id},
            {'title': 'موعد نهائي للتسليم', 'description': 'تسليم التقرير النهائي', 'reminder_type': 'deadline', 'reminder_date': datetime.now() + timedelta(days=7), 'company_id': companies[2].id}
        ]
        
        for reminder_data in reminders_data:
            reminder = Reminder(**reminder_data)
            db.session.add(reminder)
    
    # إضافة إجراءات تجريبية
    if companies:
        actions_data = [
            {'title': 'اتصال أولي', 'description': 'تم الاتصال بالشركة لأول مرة', 'action_type': 'call', 'company_id': companies[0].id},
            {'title': 'مراجعة الملف', 'description': 'تمت مراجعة ملف الشركة', 'action_type': 'review', 'company_id': companies[1].id},
            {'title': 'إجراء مهم', 'description': 'تم اتخاذ إجراء مهم للشركة', 'action_type': 'important', 'company_id': companies[2].id}
        ]
        
        for action_data in actions_data:
            action = Action(**action_data)
            db.session.add(action)
    
    db.session.commit()
    print('تم إنشاء البيانات التجريبية بنجاح')

