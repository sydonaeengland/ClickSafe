import { Header } from '@/components/Header';
import { scamStatistics } from '@/lib/mockData';
import { AlertTriangle, TrendingUp, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const TopScams = () => {
  const totalScams = scamStatistics.reduce((acc, stat) => acc + stat.count, 0);

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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-risk-high/10 text-risk-high">
              <AlertTriangle className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Top Scams Targeting Students
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed about the most common scam types we've detected. 
            Knowledge is your best defense.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-3 gap-4 mb-10"
        >
          <div className="cyber-card text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-risk-high" />
            <div className="text-3xl font-bold text-foreground">
              {totalScams.toLocaleString()}+
            </div>
            <div className="text-sm text-muted-foreground">Scams Detected</div>
          </div>
          <div className="cyber-card text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold text-foreground">87%</div>
            <div className="text-sm text-muted-foreground">Target Students</div>
          </div>
          <div className="cyber-card text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-risk-low" />
            <div className="text-3xl font-bold text-foreground">95%</div>
            <div className="text-sm text-muted-foreground">Detection Rate</div>
          </div>
        </motion.div>

        {/* Scam Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scamStatistics.map((scam, index) => (
            <motion.div
              key={scam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="cyber-card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{scam.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{scam.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {scam.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 flex-1 rounded-full bg-muted overflow-hidden`}>
                      <div
                        className={`h-full ${scam.color} rounded-full`}
                        style={{ width: `${(scam.count / totalScams) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {scam.count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Warning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 cyber-card border-2 border-risk-medium/30 bg-risk-medium-bg/30"
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
      </main>
    </div>
  );
};

export default TopScams;
