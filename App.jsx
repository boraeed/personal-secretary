import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Building, Phone, Calendar, CheckCircle, Clock, AlertTriangle, Search, Bell, User, Home, FileText, Settings } from 'lucide-react'
import './App.css'

function App() {
  const [companies, setCompanies] = useState([])
  const [reminders, setReminders] = useState([])
  const [stats, setStats] = useState({})
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [companyActions, setCompanyActions] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  // جلب البيانات من API
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // جلب الإحصائيات
      const statsResponse = await fetch('/api/stats')
      const statsData = await statsResponse.json()
      setStats(statsData)

      // جلب الشركات
      const companiesResponse = await fetch('/api/companies')
      const companiesData = await companiesResponse.json()
      setCompanies(companiesData)

      // جلب التذكيرات
      const remindersResponse = await fetch('/api/reminders')
      const remindersData = await remindersResponse.json()
      setReminders(remindersData)

      setLoading(false)
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error)
      setLoading(false)
    }
  }

  const fetchCompanyActions = async (companyId) => {
    try {
      const response = await fetch(`/api/companies/${companyId}/actions`)
      const data = await response.json()
      setCompanyActions(data)
    } catch (error) {
      console.error('خطأ في جلب إجراءات الشركة:', error)
    }
  }

  const handleCompanySelect = (company) => {
    setSelectedCompany(company)
    fetchCompanyActions(company.id)
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'قيد الانتظار', variant: 'secondary' },
      inprogress: { label: 'قيد التنفيذ', variant: 'default' },
      completed: { label: 'مكتمل', variant: 'success' }
    }
    const statusInfo = statusMap[status] || { label: status, variant: 'secondary' }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const getReminderIcon = (type) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />
      case 'review': return <FileText className="w-4 h-4" />
      case 'deadline': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* الشريط الجانبي */}
      <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6">
        <div className="text-center mb-8 border-b border-blue-700 pb-6">
          <h1 className="text-xl font-bold mb-2">السكرتير الإلكتروني</h1>
          <p className="text-blue-200 text-sm">إدارة متابعة الشركات والوعاء الزكوي</p>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>الرئيسية</span>
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === 'companies' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <Building className="w-5 h-5" />
            <span>الشركات</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === 'reports' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>التقارير</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>الإعدادات</span>
          </button>
        </nav>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col">
        {/* الهيدر */}
        <header className="bg-white shadow-sm p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            <p className="text-gray-600">مرحباً بك في نظام إدارة متابعة الشركات</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="البحث عن شركة..." className="pr-10 w-64" />
            </div>
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
              <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {reminders.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-8 h-8 text-gray-600" />
              <span className="text-gray-700">المستخدم</span>
            </div>
          </div>
        </header>

        {/* المحتوى */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* الإحصائيات */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="text-2xl font-bold text-gray-800">{stats.total_companies || 0}</h3>
                      <p className="text-gray-600">إجمالي الشركات</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <h3 className="text-2xl font-bold text-gray-800">{stats.pending_reminders || 0}</h3>
                      <p className="text-gray-600">التذكيرات المعلقة</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="text-2xl font-bold text-gray-800">{stats.completed_companies || 0}</h3>
                      <p className="text-gray-600">المهام المكتملة</p>
                    </CardContent>
                  </Card>
                </div>

                {/* التذكيرات */}
                <Card>
                  <CardHeader>
                    <CardTitle>التذكيرات القادمة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reminders.slice(0, 5).map((reminder) => (
                        <div key={reminder.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            {getReminderIcon(reminder.reminder_type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{reminder.title}</h4>
                            <p className="text-sm text-gray-600">{reminder.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(reminder.reminder_date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* قائمة الشركات */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>الشركات</CardTitle>
                    <CardDescription>قائمة بأحدث الشركات المضافة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {companies.slice(0, 5).map((company) => (
                        <div
                          key={company.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                          onClick={() => handleCompanySelect(company)}
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{company.name}</h4>
                            <p className="text-xs text-gray-600">{company.contact_person}</p>
                          </div>
                          {getStatusBadge(company.status)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'companies' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* قائمة الشركات */}
              <Card>
                <CardHeader>
                  <CardTitle>جميع الشركات</CardTitle>
                  <CardDescription>إدارة ومتابعة الشركات</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {companies.map((company) => (
                      <div
                        key={company.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCompany?.id === company.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleCompanySelect(company)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{company.name}</h3>
                          {getStatusBadge(company.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">السجل التجاري: {company.commercial_register}</p>
                        <p className="text-sm text-gray-600 mb-1">جهة الاتصال: {company.contact_person}</p>
                        <p className="text-sm text-gray-600">الهاتف: {company.phone}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* تفاصيل الشركة */}
              {selectedCompany && (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedCompany.name}</CardTitle>
                    <CardDescription>تفاصيل الشركة والإجراءات المتخذة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">معلومات الشركة</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">السجل التجاري:</span> {selectedCompany.commercial_register}</p>
                          <p><span className="font-medium">جهة الاتصال:</span> {selectedCompany.contact_person}</p>
                          <p><span className="font-medium">الهاتف:</span> {selectedCompany.phone}</p>
                          <p><span className="font-medium">البريد الإلكتروني:</span> {selectedCompany.email}</p>
                          <p><span className="font-medium">الحالة:</span> {getStatusBadge(selectedCompany.status)}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">الإجراءات المتخذة</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {companyActions.map((action) => (
                            <div key={action.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                {getReminderIcon(action.action_type)}
                                <h5 className="font-medium text-sm">{action.title}</h5>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{action.description}</p>
                              <p className="text-xs text-gray-500">{formatDate(action.action_date)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <Card>
              <CardHeader>
                <CardTitle>التقارير</CardTitle>
                <CardDescription>تقارير شاملة عن أداء المتابعة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">قسم التقارير قيد التطوير</h3>
                  <p className="text-gray-500">سيتم إضافة التقارير التفصيلية قريباً</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات</CardTitle>
                <CardDescription>إعدادات النظام والتفضيلات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">قسم الإعدادات قيد التطوير</h3>
                  <p className="text-gray-500">سيتم إضافة الإعدادات قريباً</p>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}

export default App

