'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Edit, Trash2, Eye, Calendar, Activity, Languages } from 'lucide-react';
import Link from 'next/link';
import { Patient, getPatients, deletePatient } from '@/lib/database';
import { translateText } from '@/lib/ayurvedic-data';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center relative">
        {/* Floating Ayurveda leaf accent */}
        <svg className="absolute left-8 top-8 w-24 h-24 opacity-10 text-primary animate-float-slow z-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2C12 2 20 8 20 14C20 18 16 22 12 22C8 22 4 18 4 14C4 8 12 2 12 2Z" />
          <path d="M12 8V14" />
        </svg>
        <div className="text-center relative z-10">
          <Activity className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-x-hidden">
      {/* Floating Ayurveda leaf accents */}
      <svg className="absolute left-0 top-0 w-32 h-32 opacity-10 text-primary animate-float-slow z-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2C12 2 20 8 20 14C20 18 16 22 12 22C8 22 4 18 4 14C4 8 12 2 12 2Z" />
        <path d="M12 8V14" />
      </svg>
      <svg className="absolute right-0 bottom-0 w-24 h-24 opacity-10 text-emerald-600 animate-float-slower z-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2C12 2 20 8 20 14C20 18 16 22 12 22C8 22 4 18 4 14C4 8 12 2 12 2Z" />
        <path d="M12 8V14" />
      </svg>
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">AhaarWISE</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center space-x-2"
              >
                <Languages className="h-4 w-4" />
                <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Practitioner tip */}
        <div className="mb-8 flex items-center gap-4 animate-fade-in">
          <svg className="w-7 h-7 text-primary/80 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2C12 2 20 8 20 14C20 18 16 22 12 22C8 22 4 18 4 14C4 8 12 2 12 2Z" />
            <path d="M12 8V14" />
          </svg>
          <div>
            <h2 className="text-lg font-bold text-primary mb-1">Tip: Quickly filter patients by constitution or condition to personalize diet charts.</h2>
            <span className="text-sm text-muted-foreground">Efficient workflow for busy practitioners.</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${language === 'hi' ? 'font-devanagari' : ''}`}>
            {currentContent.title}
          </h1>
          <p className={`text-muted-foreground text-lg ${language === 'hi' ? 'font-devanagari' : ''}`}>
            {currentContent.subtitle}
          </p>
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
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className={`text-lg font-semibold mb-2 ${language === 'hi' ? 'font-devanagari' : ''}`}>
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
                className="hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-primary/40"
                tabIndex={0}
                aria-label={`Patient card for ${patient.name}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200">{patient.name}</CardTitle>
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
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className={`text-sm font-medium mb-1 ${language === 'hi' ? 'font-devanagari' : ''}`}>
                        {currentContent.constitution}
                      </p>
                      <Badge variant="outline" className="capitalize">
                        {patient.constitution}
                      </Badge>
                    </div>
                    {patient.currentConditions.length > 0 && (
                      <div>
                        <p className={`text-sm font-medium mb-1 ${language === 'hi' ? 'font-devanagari' : ''}`}>
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
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className={language === 'hi' ? 'font-devanagari' : ''}>
                        {currentContent.lastUpdated}: {new Date(patient.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Link href={`/patients/${patient.id}`} className="flex-1" aria-label={`View details for ${patient.name}`}> 
                        <Button variant="outline" size="sm" className="w-full bg-transparent group" aria-label="View patient details">
                          <Eye className="h-3 w-3 mr-1" />
                          <span className={language === 'hi' ? 'font-devanagari' : ''}>
                            {currentContent.view}
                          </span>
                          <span className="sr-only">View patient details</span>
                        </Button>
                      </Link>
                      <Link href={`/patients/${patient.id}/edit`} className="flex-1" aria-label={`Edit details for ${patient.name}`}> 
                        <Button variant="outline" size="sm" className="w-full bg-transparent group" aria-label="Edit patient details">
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
                        className="text-destructive hover:text-destructive group"
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
    </div>
  );
}
