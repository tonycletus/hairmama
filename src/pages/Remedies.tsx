import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AppLayout from "@/components/layout/AppLayout";
import { 
  Leaf, 
  Clock, 
  Star, 
  Search, 
  Filter,
  Play,
  CheckCircle,
  Timer
} from "lucide-react";

const remedies = [
  {
    id: 1,
    name: "Rosemary Oil Scalp Massage",
    category: "Growth",
    difficulty: "Easy",
    duration: "15 min",
    ingredients: ["Rosemary essential oil", "Carrier oil (coconut/jojoba)"],
    instructions: [
      "Mix 3-4 drops of rosemary oil with 2 tbsp carrier oil",
      "Warm the mixture slightly",
      "Massage into scalp using circular motions",
      "Leave for 30 minutes before washing"
    ],
    benefits: "Stimulates blood circulation, promotes hair growth",
    rating: 4.8,
    completions: 1234
  },
  {
    id: 2,
    name: "Protein-Rich Egg Mask",
    category: "Repair",
    difficulty: "Easy",
    duration: "20 min",
    ingredients: ["2 eggs", "1 tbsp honey", "1 tbsp olive oil"],
    instructions: [
      "Beat eggs in a bowl",
      "Add honey and olive oil",
      "Apply to damp hair from roots to ends",
      "Cover with shower cap, leave for 20 minutes",
      "Rinse with cool water"
    ],
    benefits: "Strengthens hair, repairs damage, adds shine",
    rating: 4.6,
    completions: 987
  },
  {
    id: 3,
    name: "Aloe Vera Hydrating Treatment",
    category: "Moisture",
    difficulty: "Easy",
    duration: "30 min",
    ingredients: ["Fresh aloe vera gel", "Coconut oil", "Honey"],
    instructions: [
      "Extract gel from aloe vera leaf",
      "Mix with 1 tbsp coconut oil and honey",
      "Apply to clean, damp hair",
      "Massage gently and leave for 30 minutes",
      "Rinse thoroughly"
    ],
    benefits: "Deep hydration, soothes scalp, reduces frizz",
    rating: 4.7,
    completions: 756
  },
  {
    id: 4,
    name: "Green Tea Rinse",
    category: "Shine",
    difficulty: "Easy",
    duration: "5 min",
    ingredients: ["Green tea bags", "Hot water"],
    instructions: [
      "Steep 3 green tea bags in 2 cups hot water",
      "Let cool to room temperature",
      "After shampooing, pour over hair",
      "Massage into scalp",
      "No need to rinse out"
    ],
    benefits: "Adds shine, reduces hair loss, antioxidant properties",
    rating: 4.4,
    completions: 543
  },
  {
    id: 5,
    name: "Avocado Deep Conditioning Mask",
    category: "Repair",
    difficulty: "Medium",
    duration: "45 min",
    ingredients: ["1 ripe avocado", "2 tbsp honey", "1 tbsp coconut oil"],
    instructions: [
      "Mash avocado until smooth",
      "Mix in honey and coconut oil",
      "Apply to clean, damp hair",
      "Focus on mid-lengths and ends",
      "Cover and leave for 45 minutes",
      "Rinse thoroughly with cool water"
    ],
    benefits: "Deep conditioning, repairs split ends, adds softness",
    rating: 4.9,
    completions: 432
  },
  {
    id: 6,
    name: "Apple Cider Vinegar Clarifying Rinse",
    category: "Cleanse",
    difficulty: "Easy",
    duration: "10 min",
    ingredients: ["Apple cider vinegar", "Water"],
    instructions: [
      "Mix 2 tbsp ACV with 1 cup water",
      "After shampooing, pour mixture over hair",
      "Massage into scalp and hair",
      "Leave for 2-3 minutes",
      "Rinse thoroughly with cool water"
    ],
    benefits: "Removes buildup, balances pH, adds shine",
    rating: 4.3,
    completions: 321
  }
];

const Remedies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRemedy, setSelectedRemedy] = useState<typeof remedies[0] | null>(null);

  const categories = ["All", "Growth", "Repair", "Moisture", "Shine", "Cleanse"];

  const filteredRemedies = remedies.filter(remedy => {
    const matchesSearch = remedy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         remedy.benefits.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || remedy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success/20 text-success";
      case "Medium": return "bg-warning/20 text-warning";
      case "Hard": return "bg-destructive/20 text-destructive";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  if (selectedRemedy) {
    return (
      <AppLayout title="Remedy Details" subtitle={selectedRemedy.name}>
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedRemedy(null)}
            className="mb-6"
          >
            ← Back to Remedies
          </Button>

          <Card className="glass-card border-border/30">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedRemedy.name}</CardTitle>
                  <CardDescription className="mt-2">{selectedRemedy.benefits}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-warning fill-current" />
                  <span className="text-sm font-medium">{selectedRemedy.rating}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Badge variant="secondary">{selectedRemedy.category}</Badge>
                <Badge className={getDifficultyColor(selectedRemedy.difficulty)}>
                  {selectedRemedy.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedRemedy.duration}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedRemedy.ingredients.map((ingredient, index) => (
                    <div key={index} className="p-3 glass-secondary rounded-lg">
                      <CheckCircle className="h-4 w-4 text-success inline mr-2" />
                      {ingredient}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                <div className="space-y-3">
                  {selectedRemedy.instructions.map((step, index) => (
                    <div key={index} className="flex gap-3 p-3 glass-secondary rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Start Treatment
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Set Timer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Natural Remedies" subtitle="DIY treatments for healthy hair">
      <div className="space-y-6">
        {/* Search and Filter */}
        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search remedies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Remedies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRemedies.map((remedy) => (
            <Card 
              key={remedy.id} 
              className="glass-card border-border/30 cursor-pointer transition-all hover:scale-105"
              onClick={() => setSelectedRemedy(remedy)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{remedy.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {remedy.benefits}
                    </CardDescription>
                  </div>
                  <Leaf className="h-5 w-5 text-success flex-shrink-0 ml-2" />
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary">{remedy.category}</Badge>
                  <Badge className={getDifficultyColor(remedy.difficulty)}>
                    {remedy.difficulty}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {remedy.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-warning fill-current" />
                    {remedy.rating}
                  </div>
                  <div>{remedy.completions} completions</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRemedies.length === 0 && (
          <Card className="glass-card border-border/30">
            <CardContent className="text-center py-12">
              <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No remedies found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Remedies;