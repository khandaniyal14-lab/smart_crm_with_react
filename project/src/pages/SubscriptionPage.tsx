import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, Star, Zap, Shield, Users, BarChart, Bot, Crown } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();

  const currentPlan = 'free'; // This would come from the organization data

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        'Up to 100 leads per month',
        'Basic lead scoring',
        'Email support',
        '2 team members',
        'Basic reporting',
        'Mobile app access'
      ],
      limitations: [
        'Limited AI features',
        'Basic complaint management',
        'No advanced analytics'
      ],
      color: 'gray',
      icon: Shield
    },
    {
      name: 'Premium',
      price: 49,
      period: 'month',
      description: 'For growing businesses',
      features: [
        'Unlimited leads',
        'Advanced AI lead scoring',
        'Priority support',
        'Unlimited team members',
        'Advanced analytics',
        'Custom integrations',
        'RAG-powered chatbot',
        'Automated workflows',
        'Advanced complaint routing',
        'SerpAPI lead generation',
        'Custom reports',
        'White-label options'
      ],
      color: 'blue',
      icon: Crown,
      popular: true
    }
  ];

  const features = [
    {
      category: 'Lead Management',
      free: ['Basic lead scoring', 'Manual lead entry', 'Basic search'],
      premium: ['AI lead scoring', 'Automated lead capture', 'Advanced search & filters', 'Lead source tracking', 'Conversion analytics']
    },
    {
      category: 'Complaint Management',
      free: ['Basic complaint tracking', 'Manual assignment'],
      premium: ['AI-powered categorization', 'Automated routing', 'Priority scoring', 'Customer sentiment analysis', 'Resolution tracking']
    },
    {
      category: 'AI Features',
      free: ['Basic chatbot'],
      premium: ['RAG-powered chatbot', 'Predictive analytics', 'Automated workflows', 'Smart recommendations', 'Custom AI models']
    },
    {
      category: 'Team & Organization',
      free: ['2 team members', 'Basic roles'],
      premium: ['Unlimited team members', 'Advanced permissions', 'Department management', 'Activity tracking', 'Performance metrics']
    },
    {
      category: 'Integrations & API',
      free: ['Basic email integration'],
      premium: ['SerpAPI integration', 'Custom API access', 'Webhook support', 'CRM integrations', 'Third-party connectors']
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Unlock the full potential of Smart CRM with our premium features
        </p>
      </div>

      {/* Current Plan Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <p className="text-gray-600">
              You are currently on the <span className="font-medium capitalize">{currentPlan}</span> plan
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentPlan === 'free' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {currentPlan === 'free' ? 'Free Plan' : 'Premium Plan'}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
              plan.popular ? 'border-blue-500 scale-105' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </div>
              </div>
            )}

            <div className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg ${
                  plan.color === 'gray' ? 'bg-gray-100' : 'bg-blue-100'
                }`}>
                  <plan.icon className={`w-6 h-6 ${
                    plan.color === 'gray' ? 'text-gray-600' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-500 ml-2">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.limitations && (
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Limitations:</h4>
                  <ul className="space-y-2">
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-500">
                        <span className="mr-2">•</span>
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                disabled={currentPlan === plan.name.toLowerCase()}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  currentPlan === plan.name.toLowerCase()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {currentPlan === plan.name.toLowerCase() ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Feature Comparison</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {features.map((category, index) => (
            <div key={index} className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                {category.category === 'Lead Management' && <Users className="w-5 h-5 mr-2 text-blue-600" />}
                {category.category === 'Complaint Management' && <Shield className="w-5 h-5 mr-2 text-red-600" />}
                {category.category === 'AI Features' && <Bot className="w-5 h-5 mr-2 text-purple-600" />}
                {category.category === 'Team & Organization' && <Users className="w-5 h-5 mr-2 text-green-600" />}
                {category.category === 'Integrations & API' && <Zap className="w-5 h-5 mr-2 text-yellow-600" />}
                {category.category}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Free Plan</h5>
                  <ul className="space-y-1">
                    {category.free.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <Check className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">Premium Plan</h5>
                  <ul className="space-y-1">
                    {category.premium.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <Check className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Ready to Supercharge Your CRM?</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Join thousands of businesses using Smart CRM to accelerate their growth with AI-powered features
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Start Premium Trial
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPage;