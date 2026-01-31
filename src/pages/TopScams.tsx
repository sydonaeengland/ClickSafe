import { Header } from '@/components/Header';
import { AlertTriangle, TrendingUp, Users, Shield, Mail, Briefcase, CreditCard, GraduationCap, Package, Lightbulb, Rocket, Zap, Eye, Bell, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Weekly scam activity data
const weeklyScamData = [
  { day: 'Mon', scams: 145, fill: 'hsl(var(--primary))' },
  { day: 'Tue', scams: 198, fill: 'hsl(var(--primary))' },
  { day: 'Wed', scams: 167, fill: 'hsl(var(--primary))' },
  { day: 'Thu', scams: 234, fill: 'hsl(var(--risk-high))' },
  { day: 'Fri', scams: 289, fill: 'hsl(var(--risk-high))' },
  { day: 'Sat', scams: 112, fill: 'hsl(var(--primary))' },
  { day: 'Sun', scams: 89, fill: 'hsl(var(--primary))' },
];

// Scam categories with detailed descriptions
const scamCategories = [
  {
    id: 'phishing',
    name: 'Phishing Emails',
    icon: Mail,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    count: 5234,
    description: 'Fake emails pretending to be from trusted sources like your university, bank, or popular services. They try to steal your login credentials or personal info.',
  },
  {
    id: 'job',
    name: 'Fake Job Offers',
    icon: Briefcase,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    count: 3921,
    description: 'Too-good-to-be-true job opportunities that require upfront "training fees" or ask for your bank details before you even start working.',
  },
  {
    id: 'account',
    name: 'Account Verification Scams',
    icon: CreditCard,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    count: 4156,
    description: 'Urgent messages claiming your account is suspended or needs verification. These create panic to make you click malicious links.',
  },
  {
    id: 'scholarship',
    name: 'Scholarship & Financial Aid Scams',
    icon: GraduationCap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    count: 2847,
    description: 'Fake scholarships that promise free money but require application fees or personal information. Real scholarships never charge fees!',
  },
  {
    id: 'delivery',
    name: 'Package Delivery Scams',
    icon: Package,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    count: 1856,
    description: 'Fake delivery notifications about packages you never ordered. They contain links to steal your payment info or install malware.',
  },
];

// Safety tips for students
const safetyTips = [
  {
    tip: 'Never share passwords, SSN, or bank details via email or text',
    icon: '🔐',
  },
  {
    tip: 'Verify sender addresses carefully — scammers use similar-looking domains',
    icon: '👁️',
  },
  {
    tip: 'Hover over links before clicking to see the real destination',
    icon: '🔗',
  },
  {
    tip: 'If it sounds too good to be true, it probably is',
    icon: '⚠️',
  },
  {
    tip: 'Contact organizations directly using official channels, not links in emails',
    icon: '📞',
  },
  {
    tip: 'Report suspicious emails to your campus IT security team',
    icon: '🛡️',
  },
];

// Coming soon features
const comingSoonFeatures = [
  {
    title: 'Real-Time Scam Trends',
    description: 'Live dashboard showing emerging scam patterns as they happen',
    icon: Zap,
  },
  {
    title: 'Campus-Specific Alerts',
    description: 'Get notified about scams targeting your specific university',
    icon: Bell,
  },
  {
    title: 'Improved Detection Accuracy',
    description: 'Enhanced AI models trained on the latest scam techniques',
    icon: Eye,
  },
  {
    title: 'Community Reporting',
    description: 'Help protect others by sharing scam examples you encounter',
    icon: Users,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-foreground font-medium">{label}</p>
        <p className="text-primary text-sm">{payload[0].value} scams detected</p>
      </div>
    );
  }
  return null;
};

const TopScams = () => {
  const totalScams = scamCategories.reduce((acc, cat) => acc + cat.count, 0);
  const weeklyTotal = weeklyScamData.reduce((acc, day) => acc + day.scams, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-risk-high/10 text-risk-high animate-pulse-slow">
              <AlertTriangle className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Top Scams Targeting Students
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed about the most common scam types we've detected. 
            Knowledge is your best defense against cyber threats.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-3 gap-4 mb-10"
        >
          <div className="cyber-card-glow text-center group hover:scale-[1.02] transition-transform">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-risk-high group-hover:scale-110 transition-transform" />
            <div className="text-3xl font-bold text-foreground">
              {totalScams.toLocaleString()}+
            </div>
            <div className="text-sm text-muted-foreground">Scams Detected</div>
          </div>
          <div className="cyber-card-glow text-center group hover:scale-[1.02] transition-transform">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
            <div className="text-3xl font-bold text-foreground">87%</div>
            <div className="text-sm text-muted-foreground">Target Students</div>
          </div>
          <div className="cyber-card-glow text-center group hover:scale-[1.02] transition-transform">
            <Shield className="h-8 w-8 mx-auto mb-2 text-risk-low group-hover:scale-110 transition-transform" />
            <div className="text-3xl font-bold text-foreground">95%</div>
            <div className="text-sm text-muted-foreground">Detection Rate</div>
          </div>
        </motion.div>

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="cyber-card mb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Weekly Scam Activity</h2>
              <p className="text-sm text-muted-foreground">{weeklyTotal} scams detected this week</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyScamData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
                <Bar 
                  dataKey="scams" 
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                  animationBegin={300}
                >
                  {weeklyScamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            📈 Peak activity on Thursday & Friday — scammers know you're busy before the weekend!
          </p>
        </motion.div>

        {/* Scam Categories Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-risk-medium" />
            Common Scam Categories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scamCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="cyber-card hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                        <span className="text-sm font-bold text-primary">{category.count.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Safety Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="cyber-card-glow mb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-risk-low/10">
              <Lightbulb className="h-5 w-5 text-risk-low" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Tips for Students to Stay Safe</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {safetyTips.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm text-foreground">{item.tip}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Warning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="cyber-card border-2 border-risk-medium/30 bg-risk-medium-bg/30 mb-10"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-risk-medium shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Why Students Are Targeted
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • <strong className="text-foreground">Financial stress:</strong> Students often need money for tuition, making fake scholarship and job offers appealing
                </li>
                <li>
                  • <strong className="text-foreground">New to email scams:</strong> Many students haven't encountered sophisticated phishing before
                </li>
                <li>
                  • <strong className="text-foreground">Trust in institutions:</strong> Scammers impersonate universities, financial aid offices, and well-known companies
                </li>
                <li>
                  • <strong className="text-foreground">Urgency tactics:</strong> Busy students may not take time to verify suspicious requests
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Things Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cyber-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 animate-neon-pulse">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Things Coming Soon</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {comingSoonFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + index * 0.05 }}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-background/30 hover:border-primary/30 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TopScams;
