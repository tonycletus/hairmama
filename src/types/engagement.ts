export interface HairGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  initialValue: number;
  unit: string;
  targetDate: Date;
  startDate: Date;
  category: 'length' | 'thickness' | 'moisture' | 'strength' | 'curl_definition' | 'scalp_health';
  status: 'active' | 'completed' | 'paused';
  progress: number; // 0-100
  milestones: GoalMilestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalMilestone {
  id: string;
  goalId: string;
  title: string;
  targetValue: number;
  currentValue: number;
  targetDate: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface HairRoutine {
  id: string;
  userId: string;
  name: string;
  description: string;
  steps: RoutineStep[];
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  customDays?: number[];
  timeOfDay: 'morning' | 'evening' | 'anytime';
  estimatedDuration: number; // in minutes
  products: RoutineProduct[];
  tips: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutineStep {
  id: string;
  order: number;
  title: string;
  description: string;
  duration: number; // in minutes
  productIds: string[];
  tips: string[];
}

export interface RoutineProduct {
  id: string;
  name: string;
  brand: string;
  category: 'shampoo' | 'conditioner' | 'mask' | 'oil' | 'serum' | 'styling' | 'other';
  ingredients: string[];
  safetyScore?: number; // 0-100
  isVerified: boolean;
}

export interface IngredientAnalysis {
  ingredient: string;
  safetyScore: number; // 0-100
  category: 'safe' | 'moderate' | 'harmful' | 'unknown';
  description: string;
  concerns: string[];
  alternatives: string[];
  sources: string[];
  lastUpdated?: Date; // For real-time data tracking
}

export interface ProductAnalysis {
  productId: string;
  name: string;
  brand: string;
  overallScore: number; // 0-100
  ingredients: IngredientAnalysis[];
  recommendations: string[];
  saferAlternatives: RoutineProduct[];
  lastUpdated: Date;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'routine' | 'goal' | 'product' | 'general';
  scheduledFor: Date;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  routineId?: string;
  goalId?: string;
  createdAt: Date;
}

export interface CommunityPost {
  id: string;
  userId: string;
  isAnonymous: boolean;
  title: string;
  content: string;
  category: 'progress' | 'routine' | 'product_review' | 'question' | 'tip';
  hairType?: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  isAnonymous: boolean;
  content: string;
  likes: number;
  createdAt: Date;
}

export interface ExternalAPIConfig {
  name: string;
  baseUrl: string;
  apiKey?: string;
  rateLimit: number; // requests per minute
  isAvailable: boolean;
  lastChecked: Date;
}

export interface CachedData {
  key: string;
  data: any;
  expiresAt: Date;
  source: string;
}

export interface NutritionData {
  foodId: string;
  name: string;
  nutrients: {
    protein?: number;
    biotin?: number;
    vitaminA?: number;
    vitaminC?: number;
    vitaminE?: number;
    zinc?: number;
    iron?: number;
    omega3?: number;
  };
  hairBenefits: string[];
}

export interface ScientificArticle {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  publicationDate: Date;
  doi: string;
  relevanceScore: number; // 0-100
  hairTopics: string[];
}

export interface HairPhoto {
  id: string;
  userId: string;
  photoUrl: string;
  thumbnailUrl?: string;
  dateUploaded: Date;
  title?: string;
  description?: string;
  analysisResults?: HairAnalysisResults;
  tags?: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HairAnalysisResults {
  hairType?: string;
  hairCondition?: string;
  moistureLevel?: number;
  scalpHealth?: string;
  damageLevel?: number;
  recommendations?: string[];
  confidence?: number;
  analysisDate: Date;
}

export interface OfflineData {
  routines: HairRoutine[];
  goals: HairGoal[];
  reminders: Reminder[];
  cachedAnalyses: CachedData[];
  lastSync: Date;
}

