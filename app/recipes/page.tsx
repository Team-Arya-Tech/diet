"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useTranslation } from "@/components/translation-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Clock, 
  Users, 
  ChefHat, 
  Flame, 
  Leaf, 
  Star, 
  Plus,
  Search,
  BookOpen,
  Calculator,
  Heart,
  Filter,
  Download,
  Share2
} from "lucide-react"

export default function RecipesPage() {
  const { t, language } = useTranslation();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedConstitution, setSelectedConstitution] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [activeTab, setActiveTab] = useState("recipes");

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Failed to load recipes:", err));
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    if (searchQuery && !recipe.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory && recipe.category !== selectedCategory) return false;
    if (selectedConstitution && !recipe.ayurvedicProperties?.constitution?.includes(selectedConstitution)) return false;
    if (selectedSeason && !recipe.ayurvedicProperties?.season?.includes(selectedSeason)) return false;
    if (selectedDifficulty && recipe.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedConstitution("");
    setSelectedSeason("");
    setSelectedDifficulty("");
  };

  const exportRecipe = (recipe: any) => {
    const recipeText = generateRecipeText(recipe);
    const blob = new Blob([recipeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${recipe.name.replace(/\s+/g, '-').toLowerCase()}-recipe.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateRecipeText = (recipe: any): string => {
    return `${recipe.name}
${'='.repeat(recipe.name.length)}

${recipe.description}

Cuisine: ${recipe.cuisine}
Category: ${recipe.category}
Difficulty: ${recipe.difficulty}
Prep Time: ${recipe.prepTime} mins
Cook Time: ${recipe.cookTime} mins
Total Time: ${recipe.totalTime} mins
Servings: ${recipe.servings}

INGREDIENTS:
${recipe.ingredients?.map((ing: any) => `• ${ing.quantity} ${ing.unit} ${ing.name}${ing.notes ? ` (${ing.notes})` : ''}`).join('\n') || 'N/A'}

INSTRUCTIONS:
${recipe.cookingSteps?.map((step: any) => `${step.stepNumber}. ${step.instruction}${step.ayurvedicTip ? `\n   💡 Ayurvedic Tip: ${step.ayurvedicTip}` : ''}`).join('\n\n') || 'N/A'}

NUTRITIONAL INFORMATION (Per Serving):
• Calories: ${recipe.nutritionalInfo?.caloriesPerServing || 'N/A'}
• Protein: ${recipe.nutritionalInfo?.protein || 'N/A'}g
• Carbohydrates: ${recipe.nutritionalInfo?.carbohydrates || 'N/A'}g
• Fat: ${recipe.nutritionalInfo?.fat || 'N/A'}g
• Fiber: ${recipe.nutritionalInfo?.fiber || 'N/A'}g

AYURVEDIC PROPERTIES:
• Primary Rasa: ${recipe.ayurvedicProperties?.primaryRasa?.join(', ') || 'N/A'}
• Virya: ${recipe.ayurvedicProperties?.virya || 'N/A'}
• Vipaka: ${recipe.ayurvedicProperties?.vipaka || 'N/A'}
• Digestibility: ${recipe.ayurvedicProperties?.digestibility || 'N/A'}
• Best for: ${recipe.ayurvedicProperties?.constitution?.join(', ') || 'N/A'} constitution(s)
• Ideal seasons: ${recipe.ayurvedicProperties?.season?.join(', ') || 'N/A'}

HEALTH BENEFITS:
${recipe.healthBenefits?.map((benefit: string) => `• ${benefit}`).join('\n') || 'N/A'}

AYURVEDIC GUIDELINES:
${recipe.ayurvedicGuidelines?.map((guideline: any) => `• ${guideline.principle}: ${guideline.description}`).join('\n') || 'N/A'}
`;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 min-h-screen" style={{
        backgroundImage: 'url("/main_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Header Section */}
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
                <ChefHat className="h-6 w-6 text-amber-900" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-amber-900">
                  Recipe Intelligence
                </h1>
                <p className="text-sm sm:text-base text-amber-800 mt-1">
                  Complete recipes with Ayurvedic cooking wisdom and automatic nutritional calculation
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-white/80">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Recipe
                </Button>
                <Button variant="outline" size="sm" className="bg-white/80">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Cooking Guide
                </Button>
              </div>
            </div>
          </div>
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <ChefHat className="w-4 h-4" />
            Recipes
          </TabsTrigger>
          <TabsTrigger value="cooking-guide" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Cooking Wisdom
          </TabsTrigger>
          <TabsTrigger value="nutrition-calculator" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Nutrition Calculator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipes" className="space-y-6">
          {/* Search and Filters */}
          <Card 
            className="relative overflow-hidden border-2 border-amber-900/60 shadow-md"
            style={{
              backgroundImage: 'url("/bg10.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Search className="w-5 h-5" />
                  Search & Filter Recipes
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="bg-white/80">
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="search">Search by name</Label>
                  <Input
                    id="search"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory || undefined} onValueChange={(value) => setSelectedCategory(value || "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="constitution">Constitution</Label>
                  <Select value={selectedConstitution || undefined} onValueChange={(value) => setSelectedConstitution(value || "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="All constitutions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vata">Vata</SelectItem>
                      <SelectItem value="pitta">Pitta</SelectItem>
                      <SelectItem value="kapha">Kapha</SelectItem>
                      <SelectItem value="tridoshic">Tridoshic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="season">Season</Label>
                  <Select value={selectedSeason || undefined} onValueChange={(value) => setSelectedSeason(value || "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="All seasons" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spring">Spring</SelectItem>
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="autumn">Autumn</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                      <SelectItem value="monsoon">Monsoon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={selectedDifficulty || undefined} onValueChange={(value) => setSelectedDifficulty(value || "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6 min-w-0 overflow-hidden">
            {/* Recipe List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Recipes ({filteredRecipes.length})
                </h2>
              </div>
              
              <ScrollArea className="h-[600px]">
                <div className="space-y-4 pr-4">
                  {filteredRecipes.map((recipe) => (
                    <Card 
                      key={recipe.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg relative overflow-hidden border-2 border-amber-900/60 shadow-md ${
                        selectedRecipe?.id === recipe.id ? 'ring-2 ring-amber-500' : ''
                      }`}
                      style={{
                        backgroundImage: 'url("/bg3.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        minHeight: '140px'
                      }}
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]"></div>
                      <CardHeader className="pb-3 relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg leading-tight text-gray-800">{recipe.name}</CardTitle>
                            <CardDescription className="text-sm mt-1 line-clamp-2 text-gray-700">
                              {recipe.description}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-1 ml-3">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">4.8</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 relative z-10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {(recipe.prepTime || 0) + (recipe.cookTime || 0)}m
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {recipe.servings}
                            </div>
                            <div className="flex items-center gap-1">
                              <ChefHat className="w-4 h-4" />
                              <span className="capitalize">{recipe.difficulty}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {recipe.ayurvedicProperties?.constitution?.slice(0, 2).map((const_: string) => (
                              <Badge key={const_} variant="outline" className="text-xs">
                                {const_}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredRecipes.length === 0 && (
                    <div className="text-center py-12">
                      <ChefHat className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        {recipes.length === 0 ? "Loading recipes..." : "No recipes found matching your filters."}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Recipe Detail */}
            <div className="space-y-4 min-w-0 h-full">
              {selectedRecipe ? (
                <Card className="h-[600px] min-w-0 w-full flex flex-col overflow-hidden">
                  <CardHeader className="pb-4 min-w-0 w-full overflow-hidden">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl">{selectedRecipe.name}</CardTitle>
                        <CardDescription className="text-base mt-2">
                          {selectedRecipe.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => exportRecipe(selectedRecipe)}>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          Prep: {selectedRecipe.prepTime}m | Cook: {selectedRecipe.cookTime}m | Total: {selectedRecipe.totalTime}m
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Serves {selectedRecipe.servings}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ChefHat className="w-4 h-4" />
                        <span className="text-sm capitalize">{selectedRecipe.difficulty}</span>
                      </div>
                      <Badge variant="outline">{selectedRecipe.category}</Badge>
                      <Badge variant="secondary">{selectedRecipe.cuisine}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 flex-1 min-w-0 w-full flex flex-col overflow-hidden">
                    <Tabs defaultValue="ingredients" className="h-full flex flex-col min-w-0 w-full overflow-hidden">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                        <TabsTrigger value="instructions">Instructions</TabsTrigger>
                        <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                        <TabsTrigger value="ayurveda">Ayurveda</TabsTrigger>
                      </TabsList>
                      
                      <ScrollArea className="h-[350px] mt-4 min-w-0 w-full overflow-auto">
                        <TabsContent value="ingredients" className="space-y-4">
                          <div className="grid gap-3">
                            {selectedRecipe.ingredients?.map((ingredient: any, index: number) => (
                              <div key={index} className="flex flex-wrap items-center justify-between p-3 bg-muted/30 rounded-lg min-w-0">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                  <div className="min-w-0">
                                    <div className="font-medium break-words truncate max-w-xs">{ingredient.name}</div>
                                    {ingredient.notes && (
                                      <div className="text-xs text-muted-foreground break-words truncate max-w-xs">{ingredient.notes}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-sm font-medium break-words truncate max-w-[120px] text-right">
                                  {ingredient.quantity} {ingredient.unit}
                                </div>
                              </div>
                            )) || <p>No ingredients available</p>}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="instructions" className="space-y-4">
                          <div className="space-y-4">
                            {selectedRecipe.cookingSteps?.map((step: any) => (
                              <div key={step.stepNumber} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                  {step.stepNumber}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm leading-relaxed">{step.instruction}</p>
                                  {step.ayurvedicTip && (
                                    <div className="mt-2 p-2 bg-orange-50 rounded text-xs text-orange-700">
                                      <strong>💡 Ayurvedic Tip:</strong> {step.ayurvedicTip}
                                    </div>
                                  )}
                                  {step.duration && (
                                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      {step.duration} mins
                                    </div>
                                  )}
                                </div>
                              </div>
                            )) || <p>No instructions available</p>}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="nutrition" className="space-y-4">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                  {selectedRecipe.nutritionalInfo?.caloriesPerServing || 'N/A'}
                                </div>
                                <div className="text-sm text-green-600">Calories per serving</div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                  <span className="text-sm">Protein</span>
                                  <span className="font-medium">{selectedRecipe.nutritionalInfo?.protein || 'N/A'}g</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                  <span className="text-sm">Carbohydrates</span>
                                  <span className="font-medium">{selectedRecipe.nutritionalInfo?.carbohydrates || 'N/A'}g</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                  <span className="text-sm">Fat</span>
                                  <span className="font-medium">{selectedRecipe.nutritionalInfo?.fat || 'N/A'}g</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                  <span className="text-sm">Fiber</span>
                                  <span className="font-medium">{selectedRecipe.nutritionalInfo?.fiber || 'N/A'}g</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="font-medium">Minerals & Vitamins</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                  <span>Calcium</span>
                                  <span className="font-medium">{selectedRecipe.nutritionalInfo?.calcium || 'N/A'}mg</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                  <span>Iron</span>
                                  <span className="font-medium">{selectedRecipe.nutritionalInfo?.iron || 'N/A'}mg</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                  <span>Potassium</span>
                                  <span className="font-medium">{selectedRecipe.nutritionalInfo?.potassium || 'N/A'}mg</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                  <span>Sodium</span>
                                  <span className="font-medium">{selectedRecipe.nutritionalInfo?.sodium || 'N/A'}mg</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="ayurveda" className="space-y-4">
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <span className="text-muted-foreground">Primary Rasa:</span>
                                <div className="flex gap-1 mt-1">
                                  {selectedRecipe.ayurvedicProperties?.primaryRasa?.map((rasa: string) => (
                                    <Badge key={rasa} variant="secondary" className="text-xs">
                                      {rasa}
                                    </Badge>
                                  )) || 'N/A'}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <span className="text-muted-foreground">Virya (Energy):</span>
                                <div className="flex items-center gap-2">
                                  <Flame className="w-4 h-4 text-orange-500" />
                                  <span className="capitalize font-medium">
                                    {selectedRecipe.ayurvedicProperties?.virya || 'N/A'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <span className="text-muted-foreground">Vipaka (Post-digestive effect):</span>
                                <div className="capitalize font-medium">
                                  {selectedRecipe.ayurvedicProperties?.vipaka || 'N/A'}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <span className="text-muted-foreground">Digestibility:</span>
                                <div className="capitalize font-medium">
                                  {selectedRecipe.ayurvedicProperties?.digestibility || 'N/A'}
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="space-y-4">
                              <span className="text-muted-foreground text-sm">Constitution Compatibility:</span>
                              <div className="flex gap-1 mt-2">
                                {selectedRecipe.ayurvedicProperties?.constitution?.map((const_: string) => (
                                  <Badge key={const_} variant="secondary">
                                    {const_}
                                  </Badge>
                                )) || 'N/A'}
                              </div>
                              
                              <span className="text-muted-foreground text-sm">Ideal Seasons:</span>
                              <div className="flex gap-1 mt-2">
                                {selectedRecipe.ayurvedicProperties?.season?.map((season: string) => (
                                  <Badge key={season} variant="outline">
                                    {season}
                                  </Badge>
                                )) || 'N/A'}
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="space-y-4">
                              <span className="text-muted-foreground text-sm">Health Benefits:</span>
                              <ul className="mt-2 space-y-1">
                                {selectedRecipe.healthBenefits?.map((benefit: string, index: number) => (
                                  <li key={index} className="text-sm flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                                    {benefit}
                                  </li>
                                )) || <li>No health benefits listed</li>}
                              </ul>
                              
                              <span className="text-muted-foreground text-sm">Ayurvedic Guidelines:</span>
                              <div className="mt-3 space-y-3">
                                {selectedRecipe.ayurvedicGuidelines?.map((guideline: any, index: number) => (
                                  <div key={index} className="p-3 bg-orange-50 rounded-lg border">
                                    <div className="font-medium text-sm text-orange-700">{guideline.principle}</div>
                                    <div className="text-xs text-orange-600 mt-1">{guideline.description}</div>
                                    <div className="text-xs text-orange-500 mt-2">
                                      <strong>Application:</strong> {guideline.application}
                                    </div>
                                  </div>
                                )) || <p>No guidelines available</p>}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </ScrollArea>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <ChefHat className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Select a Recipe</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a recipe from the list to view detailed information, ingredients, and cooking instructions.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cooking-guide">
          <Card>
            <CardHeader>
              <CardTitle>Ayurvedic Cooking Wisdom</CardTitle>
              <CardDescription>
                Traditional principles for healthy and harmonious cooking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Cooking guide content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition-calculator">
          <Card>
            <CardHeader>
              <CardTitle>Nutritional Calculator</CardTitle>
              <CardDescription>
                Calculate nutritional values for your custom recipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Nutrition calculator coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
}
