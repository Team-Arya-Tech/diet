// Test script to verify PDF color fixes
import { exportSimpleWeeklyDietChartPDF } from './lib/pdf-export.js'

// Mock patient data for testing
const testPatient = {
  id: 1,
  name: "Test Patient",
  age: 35,
  gender: "female",
  constitution: "pitta-vata",
  weight: 65,
  height: 165,
  bmi: 23.9,
  lifestyle: {
    activityLevel: "moderate",
    stressLevel: "medium"
  },
  currentConditions: ["Digestive issues"],
  dietaryRestrictions: ["Vegetarian"],
  allergies: [],
  contactInfo: {
    phone: "+91-9876543210",
    email: "test@example.com"
  }
}

// Mock weekly plan data
const testWeeklyPlan = [
  {
    day: 1,
    meals: {
      breakfast: {
        name: "Warm Oats with Almonds",
        items: [{ name: "Oats", calories: 150 }, { name: "Almonds", calories: 100 }],
        totalCalories: 250
      },
      lunch: {
        name: "Quinoa Bowl with Vegetables",
        items: [{ name: "Quinoa", calories: 200 }, { name: "Mixed Vegetables", calories: 100 }],
        totalCalories: 300
      },
      dinner: {
        name: "Lentil Soup with Rice",
        items: [{ name: "Lentils", calories: 180 }, { name: "Rice", calories: 120 }],
        totalCalories: 300
      },
      snacks: {
        name: "Fresh Fruits",
        items: [{ name: "Apple", calories: 80 }],
        totalCalories: 80
      }
    }
  },
  // Add 6 more days with similar structure
  ...Array.from({ length: 6 }, (_, i) => ({
    day: i + 2,
    meals: {
      breakfast: {
        name: `Day ${i + 2} Breakfast`,
        items: [{ name: "Healthy Breakfast", calories: 250 }],
        totalCalories: 250
      },
      lunch: {
        name: `Day ${i + 2} Lunch`,
        items: [{ name: "Nutritious Lunch", calories: 350 }],
        totalCalories: 350
      },
      dinner: {
        name: `Day ${i + 2} Dinner`,
        items: [{ name: "Light Dinner", calories: 300 }],
        totalCalories: 300
      },
      snacks: {
        name: `Day ${i + 2} Snacks`,
        items: [{ name: "Healthy Snacks", calories: 100 }],
        totalCalories: 100
      }
    }
  }))
]

// Mock nutritional summary
const testNutritionalSummary = {
  totalCalories: 1000,
  avgProtein: 60,
  avgCarbs: 120,
  avgFat: 40,
  avgFiber: 25
}

console.log('Testing PDF Export with Color Fixes...')

try {
  // Test the PDF export
  exportSimpleWeeklyDietChartPDF(testPatient, testWeeklyPlan, testNutritionalSummary)
  console.log('✅ PDF export test completed successfully!')
  console.log('📄 Check the generated PDF file to verify text colors are visible and properly formatted.')
  console.log('🎯 All text should appear in black color, not invisible or too light.')
} catch (error) {
  console.error('❌ PDF export test failed:', error)
}

export {}