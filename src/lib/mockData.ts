// Mock email data for demo inbox

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  snippet: string;
  body: string;
  time: string;
  date: Date;
  read: boolean;
  starred: boolean;
}

export const mockEmails: Email[] = [
  {
    id: '1',
    from: 'Financial Aid Office',
    fromEmail: 'financial.aid.update@university-support.tk',
    subject: '🚨 URGENT: Your Scholarship Has Been Approved - Action Required',
    snippet: 'Congratulations! You have been selected to receive a $5,000 scholarship. Click here to claim before it expires...',
    body: `Dear Student,

CONGRATULATIONS! 🎉

You have been specially selected to receive a $5,000 Emergency Scholarship Grant. This opportunity is only available for the next 24 HOURS.

To claim your scholarship immediately, you must:
1. Click the link below to verify your identity
2. Provide your student ID and social security number for verification
3. Enter your bank account details for direct deposit

CLAIM NOW: http://bit.ly/claim-scholarship-now

⚠️ WARNING: If you do not act within 24 hours, your scholarship will be PERMANENTLY FORFEITED and given to another student.

This is a one-time opportunity that cannot be extended.

Best regards,
Dr. James Wilson
Director of Financial Aid
University Support Center

Reply-to: scholarship-verification@gmail.com`,
    time: '10:23 AM',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    starred: false,
  },
  {
    id: '2',
    from: 'Amazon Security',
    fromEmail: 'security-alert@amaz0n-verify.com',
    subject: 'Your Amazon account has been suspended - Verify immediately',
    snippet: 'We detected unusual activity on your account. Your account will be permanently locked unless you verify...',
    body: `Dear Valued Customer,

We have detected unauthorized access attempts on your Amazon account. For your security, we have temporarily limited your account.

ACCOUNT STATUS: SUSPENDED

To restore full access to your account, you must verify your identity within 48 hours by clicking the secure link below:

🔐 Verify Your Account: http://amazon-secure-verify.online/login

If you do not verify your account, the following will occur:
- All pending orders will be cancelled
- Your account will be permanently locked
- You will lose access to your Prime membership

Please have the following information ready:
- Credit card number
- Password
- Security questions

Thank you for your immediate attention to this matter.

Amazon Security Team
© 2024 Amazon.com, Inc.`,
    time: '9:45 AM',
    date: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: false,
    starred: false,
  },
  {
    id: '3',
    from: 'Campus Library',
    fromEmail: 'library@university.edu',
    subject: 'Library Book Due Date Reminder',
    snippet: 'This is a friendly reminder that the following books are due for return on...',
    body: `Dear Student,

This is a friendly reminder that the following items checked out under your account are due for return:

📚 "Introduction to Computer Science" - Due: March 15, 2024
📚 "Data Structures and Algorithms" - Due: March 15, 2024

You can:
- Return items to any campus library location
- Renew online through your library account
- Request an extension if needed

Late fees: $0.25 per day per item

If you have any questions, please visit the library help desk or call (555) 123-4567.

Best regards,
Campus Library Services`,
    time: 'Yesterday',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    starred: false,
  },
  {
    id: '4',
    from: 'Professor Johnson',
    fromEmail: 'j.johnson@university.edu',
    subject: 'Office Hours Rescheduled This Week',
    snippet: 'Hi class, just a quick note that my office hours this Thursday will be moved to...',
    body: `Hi everyone,

Just a quick note to let you know that my regular office hours this Thursday (2-4 PM) will be moved to Friday (1-3 PM) due to a faculty meeting.

If you need to discuss your midterm results or have questions about the upcoming project, please come by during the rescheduled hours or send me an email to set up an appointment.

Also, a reminder that the project proposal is due next Monday. Make sure to review the rubric posted on the course website.

Best,
Dr. Johnson`,
    time: 'Yesterday',
    date: new Date(Date.now() - 26 * 60 * 60 * 1000),
    read: true,
    starred: true,
  },
  {
    id: '5',
    from: 'Remote Job Opportunity',
    fromEmail: 'hr@global-careers-hub.xyz',
    subject: '💰 Earn $500/Week Working From Home - No Experience Needed!',
    snippet: 'We are hiring students for easy data entry positions. Work from anywhere, set your own hours...',
    body: `🌟 AMAZING OPPORTUNITY FOR STUDENTS! 🌟

Are you looking to earn extra money while studying? We have the PERFECT opportunity for you!

POSITION: Remote Data Entry Specialist
PAY: $500-$800 per week (GUARANTEED!)
HOURS: Flexible - work whenever you want!
EXPERIENCE: None required!

All you need is:
✓ A computer or smartphone
✓ Internet connection
✓ 2-3 hours per day

To get started immediately, simply:
1. Send us your full name and phone number
2. Pay the $50 training materials fee
3. Start earning the same day!

⚡ LIMITED SPOTS AVAILABLE! ⚡

Reply to this email with "I'M INTERESTED" to secure your position.

Don't miss out on this life-changing opportunity!

Best regards,
Sarah Miller
HR Director
Global Careers Hub`,
    time: 'Mar 10',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000),
    read: false,
    starred: false,
  },
  {
    id: '6',
    from: 'Student Health Center',
    fromEmail: 'health.center@university.edu',
    subject: 'Flu Shot Clinic - Free for All Students',
    snippet: 'The Student Health Center will be offering free flu vaccinations next week...',
    body: `Dear Students,

The Student Health Center will be hosting a free flu vaccination clinic next week!

📅 When: Monday-Wednesday, March 18-20
🕐 Time: 9:00 AM - 4:00 PM
📍 Location: Student Health Center, Building B

What to bring:
- Your student ID
- Completed consent form (available at the clinic)

The flu shot is FREE for all enrolled students. No appointment necessary - walk-ins welcome!

Protect yourself and your campus community. Getting vaccinated is one of the best ways to prevent the spread of flu.

Questions? Call us at (555) 234-5678 or visit our website.

Stay healthy,
Student Health Center Team`,
    time: 'Mar 9',
    date: new Date(Date.now() - 72 * 60 * 60 * 1000),
    read: true,
    starred: false,
  },
  {
    id: '7',
    from: 'Netflix Support',
    fromEmail: 'billing@netflix-account-update.site',
    subject: 'Payment Failed - Update Your Information Now',
    snippet: 'We were unable to process your recent payment. Please update your billing information to continue...',
    body: `Netflix

Dear Member,

We were unable to validate your billing information for the next billing cycle of your subscription.

We'll try again, but in the meantime you may want to update your payment details to make sure your service is not interrupted.

UPDATE ACCOUNT NOW
[Click Here to Update Payment]
http://netflix-billing-secure.site/update

If you have recently updated your payment information, please disregard this message.

If you need help with your account, please visit our Help Center.

We're here to help if you need it.

-The Netflix Team

This message was sent from a notification-only address that cannot accept incoming email. Please do not reply to this message.`,
    time: 'Mar 8',
    date: new Date(Date.now() - 96 * 60 * 60 * 1000),
    read: false,
    starred: false,
  },
  {
    id: '8',
    from: 'Study Group - CS301',
    fromEmail: 'mike.chen@university.edu',
    subject: 'Meeting tomorrow for project work',
    snippet: 'Hey everyone, are we still meeting at the library tomorrow at 3pm? I booked study room 204...',
    body: `Hey everyone,

Are we still meeting at the library tomorrow at 3pm? I booked study room 204 for us.

I'll bring my laptop with the latest code. Can someone bring the project requirements doc? I think Sarah had the most recent version.

Also, anyone want to grab coffee after? The cafe in the library has their seasonal lattes out.

Let me know if the time doesn't work for anyone.

- Mike`,
    time: 'Mar 7',
    date: new Date(Date.now() - 120 * 60 * 60 * 1000),
    read: true,
    starred: true,
  },
];

export const scamStatistics = [
  {
    id: 'scholarship',
    name: 'Scholarship Scams',
    count: 2847,
    description: 'Fake scholarships requesting fees or personal info',
    icon: '🎓',
    color: 'bg-blue-500',
  },
  {
    id: 'job',
    name: 'Job/Internship Scams',
    count: 3921,
    description: 'Fake job offers, often requiring upfront payments',
    icon: '💼',
    color: 'bg-purple-500',
  },
  {
    id: 'account',
    name: 'Account Verification',
    count: 5234,
    description: 'Fake alerts about suspended accounts',
    icon: '🔐',
    color: 'bg-red-500',
  },
  {
    id: 'delivery',
    name: 'Package Delivery Scams',
    count: 1856,
    description: 'Fake delivery notifications with malicious links',
    icon: '📦',
    color: 'bg-orange-500',
  },
  {
    id: 'prize',
    name: 'Prize/Lottery Scams',
    count: 1243,
    description: 'Fake winnings requiring payment to claim',
    icon: '🎰',
    color: 'bg-yellow-500',
  },
  {
    id: 'tech_support',
    name: 'Tech Support Scams',
    count: 982,
    description: 'Fake virus warnings and support calls',
    icon: '💻',
    color: 'bg-green-500',
  },
];
