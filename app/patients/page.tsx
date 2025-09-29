'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Edit, Trash2, Eye, Calendar, Activity, Languages } from 'lucide-react';
import Link from 'next/link';
import { Patient, getPatients, deletePatient } from '@/lib/database';
import { translateText } from '@/lib/ayurvedic-data';
import { useTranslation } from "@/components/translation-provider";

export default function PatientsPage() {
  const { t, language, setLanguage } = useTranslation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    const allPatients = getPatients();
    setPatients(allPatients);
    setLoading(false);
  };

  const handleDeletePatient = (id: string) => {
    if (confirm(language === 'en' ? 'Are you sure you want to delete this patient?' : 'क्या आप वाकई इस रोगी को हटाना चाहते हैं?')) {
      deletePatient(id);
      loadPatients();
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.constitution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.occupation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConstitutionColor = (constitution: string) => {
    switch (constitution) {
      case 'vata': return 'bg-blue-100 text-blue-800';
      case 'pitta': return 'bg-red-100 text-red-800';
      case 'kapha': return 'bg-green-100 text-green-800';
      case 'vata-pitta': return 'bg-purple-100 text-purple-800';
      case 'pitta-kapha': return 'bg-orange-100 text-orange-800';
      case 'vata-kapha': return 'bg-teal-100 text-teal-800';
      case 'tridoshic': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const content = {
    en: {
      title: 'Patient Management',
      subtitle: 'Manage patient profiles, constitutions, and health information',
      addNew: 'Add New Patient',
      search: 'Search patients...',
      noPatients: 'No patients found',
      noResults: 'No patients match your search',
      age: 'Age',
      constitution: 'Constitution',
      conditions: 'Conditions',
      lastUpdated: 'Last Updated',
      actions: 'Actions',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete'
    },
    hi: {
      title: 'रोगी प्रबंधन',
      subtitle: 'रोगी प्रोफाइल, संविधान और स्वास्थ्य जानकारी का प्रबंधन करें',
      addNew: 'नया रोगी जोड़ें',
      search: 'रोगी खोजें...',
      noPatients: 'कोई रोगी नहीं मिला',
      noResults: 'आपकी खोज से कोई रोगी मेल नहीं खाता',
      age: 'आयु',
      constitution: 'संविधान',
      conditions: 'स्थितियां',
      lastUpdated: 'अंतिम अपडेट',
      actions: 'कार्य',
      view: 'देखें',
      edit: 'संपादित करें',
      delete: 'हटाएं'
    }
  };

  const currentContent = content[language];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center" style={{
          backgroundImage: 'url("/main_bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 min-h-screen" style={{
        backgroundImage: 'url("/main_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Header Section with Ayurvedic tip */}
        <div className="mb-6">
          <div 
            className="relative rounded-xl overflow-hidden p-6 mb-4 min-h-[120px] border-2"
            style={{
              backgroundColor: '#E8E0D0',
              borderColor: '#D4C4A8',
              backgroundImage: 'url("/banner_canva.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div 
                className="p-3 rounded-xl w-fit border-2"
                style={{
                  backgroundColor: '#F0E6D2',
                  borderColor: '#D4C4A8'
                }}
              >
                <Users className="h-6 w-6 text-amber-900" />
              </div>
              <div className="flex-1">
                <h1 className={`text-xl sm:text-2xl font-bold text-amber-900 ${language === 'hi' ? 'font-devanagari' : ''}`}>
                  {currentContent.title}
                </h1>
                <p className={`text-sm sm:text-base text-amber-800 mt-1 ${language === 'hi' ? 'font-devanagari' : ''}`}>
                  {currentContent.subtitle}
                </p>
              </div>
              {/* Language switcher is provided by DashboardLayout */}
            </div>
          </div>
        </div>
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={currentContent.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href="/patients/new">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span className={language === 'hi' ? 'font-devanagari' : ''}>
                {currentContent.addNew}
              </span>
            </Button>
          </Link>
        </div>

        {/* Patients Grid */}
        {filteredPatients.length === 0 ? (
          <Card 
            className="text-center py-12 border-2 border-amber-900/60 shadow-md"
            style={{
              backgroundImage: 'url("/bg10.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]"></div>
            <CardContent className="relative z-10">
              <Users className="h-12 w-12 text-amber-800 mx-auto mb-4" />
              <h3 className={`text-lg font-semibold mb-2 text-gray-800 ${language === 'hi' ? 'font-devanagari' : ''}`}>
                {patients.length === 0 ? currentContent.noPatients : currentContent.noResults}
              </h3>
              {patients.length === 0 && (
                <Link href="/patients/new">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className={language === 'hi' ? 'font-devanagari' : ''}>
                      {currentContent.addNew}
                    </span>
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <Card
                key={patient.id}
                className="hover:shadow-lg transition-all duration-300 relative overflow-hidden border-2 border-amber-900/60 shadow-md focus-within:ring-2 focus-within:ring-primary/40"
                style={{
                  backgroundImage: 'url("/bg3.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '200px'
                }}
                tabIndex={0}
                aria-label={`Patient card for ${patient.name}`}
              >
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800 group-hover:text-primary transition-colors duration-200">{patient.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1">
                        <span>{currentContent.age}: {patient.age}</span>
                        <span>•</span>
                        <span className="capitalize">{patient.gender}</span>
                      </CardDescription>
                    </div>
                    <Badge className={getConstitutionColor(patient.constitution)}>
                      {patient.constitution}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-3">
                    <div>
                      <p className={`text-sm font-medium mb-1 text-gray-700 ${language === 'hi' ? 'font-devanagari' : ''}`}>
                        {currentContent.constitution}
                      </p>
                      <Badge variant="outline" className={`capitalize ${getConstitutionColor(patient.constitution)}`}>
                        {patient.constitution}
                      </Badge>
                    </div>
                    {patient.currentConditions.length > 0 && (
                      <div>
                        <p className={`text-sm font-medium mb-1 text-gray-700 ${language === 'hi' ? 'font-devanagari' : ''}`}>
                          {currentContent.conditions}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {patient.currentConditions.slice(0, 2).map((condition, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                          {patient.currentConditions.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{patient.currentConditions.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className={language === 'hi' ? 'font-devanagari' : ''}>
                        {currentContent.lastUpdated}: {new Date(patient.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Link href={`/patients/${patient.id}`} className="flex-1" aria-label={`View details for ${patient.name}`}> 
                        <Button variant="outline" size="sm" className="w-full bg-white/80 group" aria-label="View patient details">
                          <Eye className="h-3 w-3 mr-1" />
                          <span className={language === 'hi' ? 'font-devanagari' : ''}>
                            {currentContent.view}
                          </span>
                          <span className="sr-only">View patient details</span>
                        </Button>
                      </Link>
                      <Link href={`/patients/${patient.id}/edit`} className="flex-1" aria-label={`Edit details for ${patient.name}`}> 
                        <Button variant="outline" size="sm" className="w-full bg-white/80 group" aria-label="Edit patient details">
                          <Edit className="h-3 w-3 mr-1" />
                          <span className={language === 'hi' ? 'font-devanagari' : ''}>
                            {currentContent.edit}
                          </span>
                          <span className="sr-only">Edit patient details</span>
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePatient(patient.id)}
                        className="text-destructive hover:text-destructive bg-white/80 group"
                        aria-label="Delete patient"
                        title="Delete patient"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Delete patient</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
