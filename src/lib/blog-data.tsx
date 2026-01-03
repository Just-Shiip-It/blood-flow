import React from 'react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  imageUrl: string;
  category: string;
  readTime: string;
  content: React.ReactNode;
  tags: string[];
}

export const CATEGORIES = ['All', 'Wellness', 'Science', 'Stories', 'Events'];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "The Story That Connected a Donor and a Recipient",
    excerpt: "A heartwarming tale of how a single donation traveled 300 miles to save a young leukemia patient named Leo. It started on a rainy Tuesday...",
    date: 'Oct 21, 2025',
    author: 'Editorial Team',
    category: 'Stories',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1516574187841-69301976e499?q=80&w=2070&auto=format&fit=crop',
    tags: ['Community', 'Impact', 'Patient Stories'],
    content: (
      <>
        <p className="lead text-xl text-slate-600 mb-8 leading-relaxed">
          It was a rainy Tuesday when Sarah received the call. Not the kind of call one expects while making morning coffee, but the kind that stops time completely.
        </p>
        <p className="mb-6 text-slate-700 leading-relaxed">
          Three hundred miles away, in a sterile room at St. Jude&apos;s, 6-year-old Leo was waiting. His body had stopped producing enough platelets to fight off the aggressive leukemia he had been battling for months. The doctors were running out of options. They needed a specific match—O Negative, CMV negative—a combination as rare as it is vital for immunocompromised patients.
        </p>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">The Decision to Give</h3>
        <p className="mb-6 text-slate-700 leading-relaxed">
          Sarah hadn&apos;t planned to donate that day. She was busy, tired, and honestly, a little afraid of needles. But a notification from the LifeFlow app popped up: <em className="text-slate-900 font-medium">&quot;Urgent Need: Type O- in your area.&quot;</em>
        </p>
        <p className="mb-6 text-slate-700 leading-relaxed">
          &quot;I almost swiped it away,&quot; Sarah recalls. &quot;But something made me stop. I thought about my own kids. If they were in that position, I&apos;d want someone to stop what they were doing and help.&quot;
        </p>
        <blockquote className="border-l-4 border-rose-500 pl-6 italic text-xl text-slate-800 my-10 font-serif bg-rose-50 py-4 pr-4 rounded-r-lg">
          &quot;I didn&apos;t know who it was for. I just knew someone needed it more than I needed 45 minutes of my time.&quot;
        </blockquote>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">The Journey</h3>
        <p className="mb-6 text-slate-700 leading-relaxed">
          Within hours of her donation at the City Central Center, her unit of blood began its own journey. It was tested, processed, and rushed via courier to the specialized pediatric wing where Leo lay.
        </p>
        <p className="mb-6 text-slate-700 leading-relaxed">
          The transfusion took place at 2:00 AM. By sunrise, Leo&apos;s color had returned. His counts stabilized. It wasn&apos;t the cure, but it was the bridge he needed to make it to his next treatment.
        </p>
        <p className="mb-6 text-slate-700 leading-relaxed">
          Six months later, through an anonymous letter exchange program facilitated by LifeFlow, Sarah received a drawing of a superhero with a red cape. The caption read: <strong>&quot;Thank you for saving me.&quot;</strong>
        </p>
      </>
    )
  },
  {
    id: '2',
    title: "Nourish Yourself: Post-Donation Recovery Guide",
    excerpt: "Discover the nutritional habits that help you recover faster. Hydration and iron-rich foods are key elements to feeling your best immediately after giving.",
    date: 'Oct 20, 2025',
    author: 'Dr. Sarah',
    category: 'Wellness',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop',
    tags: ['Health', 'Nutrition', 'Tips'],
    content: (
      <>
        <p className="lead text-xl text-slate-600 mb-8 leading-relaxed">
          You&apos;ve just done something amazing. Now, it&apos;s time to take care of the hero. Recovering from a blood donation is quick and easy if you follow a few simple nutritional rules.
        </p>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Immediate Steps (The First 15 Minutes)</h3>
        <p className="mb-6 text-slate-700 leading-relaxed">
          Don&apos;t skip the snack table! The juice and cookies aren&apos;t just a treat; they serve a medical purpose. The sugar provides a quick energy spike to combat any potential lightheadedness, and the fluids begin the volume replacement process immediately.
        </p>
        <ul className="list-disc list-inside space-y-2 mb-8 text-slate-700 ml-4">
            <li><strong>Drink:</strong> at least 500ml of water immediately.</li>
            <li><strong>Eat:</strong> A high-glycemic snack like a cookie or fruit.</li>
            <li><strong>Rest:</strong> Sit for at least 10-15 minutes before driving.</li>
        </ul>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Iron Replenishment</h3>
        <p className="mb-6 text-slate-700 leading-relaxed">
           Red blood cells require iron to carry oxygen. After donating, your body needs to ramp up production. Consuming iron-rich foods over the next 24-48 hours is crucial.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h4 className="font-bold text-green-800 mb-2">Heme Iron (Best Absorption)</h4>
                <ul className="text-sm text-green-700 space-y-1">
                    <li>• Red meat (beef, lamb)</li>
                    <li>• Poultry</li>
                    <li>• Fish and shellfish</li>
                </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h4 className="font-bold text-orange-800 mb-2">Non-Heme Iron (Good)</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Spinach and leafy greens</li>
                    <li>• Lentils and beans</li>
                    <li>• Fortified cereals</li>
                </ul>
            </div>
        </div>
        <p className="mb-6 text-slate-700 leading-relaxed">
           <strong>Pro Tip:</strong> Combine iron-rich foods with Vitamin C (like orange juice) to boost absorption by up to 300%. Avoid coffee or tea with meals, as tannins can inhibit iron absorption.
        </p>
      </>
    )
  },
  {
    id: '3',
    title: "Understanding the Unique Bouquet of Blood Products",
    excerpt: "When you donate a unit of blood, it's separated into red cells, plasma, and platelets. Here is how each part saves a different life.",
    date: 'Oct 18, 2025',
    author: 'Medical Board',
    category: 'Science',
    readTime: '8 min read',
    imageUrl: 'https://images.unsplash.com/photo-1615461166324-6412d8d19aa5?q=80&w=2070&auto=format&fit=crop',
    tags: ['Science', 'Education', 'Blood Facts'],
    content: (
      <>
        <p className="lead text-xl text-slate-600 mb-8 leading-relaxed">
           We often say &quot;blood donation,&quot; but modern medicine rarely uses whole blood as it comes out of your arm. Instead, we treat each donation as a resource to be refined.
        </p>
        <p className="mb-6 text-slate-700 leading-relaxed">
           Through a process called centrifugation, your single pint is spun at high speeds to separate it into three distinct, life-saving components. This is why we say one donation can save three lives.
        </p>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">1. Red Blood Cells (The Oxygen Carriers)</h3>
        <p className="mb-6 text-slate-700 leading-relaxed">
           <strong>Shelf Life:</strong> 42 days.<br/>
           <strong>Used For:</strong> Trauma victims, surgery patients, and those treating anemia.<br/>
           These are the heavy lifters. They carry oxygen from the lungs to the rest of the body. When someone loses a lot of blood in a car accident, this is primarily what they need replaced to stay alive.
        </p>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">2. Platelets (The Clotters)</h3>
        <p className="mb-6 text-slate-700 leading-relaxed">
           <strong>Shelf Life:</strong> Only 5-7 days.<br/>
           <strong>Used For:</strong> Cancer patients, organ transplants, and burn victims.<br/>
           Platelets are tiny cells that form clots to stop bleeding. Leukemia patients often cannot produce their own platelets, leaving them vulnerable to fatal internal bleeding. Because of their short shelf life, the demand for platelets is constant.
        </p>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">3. Plasma (The Liquid Gold)</h3>
        <p className="mb-6 text-slate-700 leading-relaxed">
           <strong>Shelf Life:</strong> Up to 1 year (frozen).<br/>
           <strong>Used For:</strong> Burn victims, shock, and clotting factor deficiencies.<br/>
           Plasma is the liquid part of the blood. It contains proteins, electrolytes, and antibodies. It helps maintain blood pressure and volume.
        </p>
      </>
    )
  },
  {
    id: '4',
    title: "Host a LifeFlow Blood Drive in Your Community",
    excerpt: "Want to help your local community flourish? Hosting a blood drive is easier than you think. Here is our step-by-step guide to organizing an event.",
    date: 'Oct 15, 2025',
    author: 'Community Team',
    category: 'Events',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2074&auto=format&fit=crop',
    tags: ['Volunteering', 'Leadership', 'Community'],
    content: (
        <>
           <p className="lead text-xl text-slate-600 mb-8 leading-relaxed">
             Hosting a blood drive is one of the most impactful ways to serve your community. It brings people together for a common cause and provides a convenient way for neighbors to save lives.
           </p>
           <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Step 1: Find a Location</h3>
           <p className="mb-6 text-slate-700 leading-relaxed">
             You need a large, open space. Community centers, school gyms, and church halls are perfect. The space needs:
           </p>
           <ul className="list-disc list-inside space-y-2 mb-8 text-slate-700 ml-4">
              <li>At least 1000 square feet of open space.</li>
              <li>Good lighting and ventilation.</li>
              <li>Access to restrooms.</li>
              <li>Tables and chairs for registration and refreshments.</li>
           </ul>
           <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Step 2: Contact LifeFlow</h3>
           <p className="mb-6 text-slate-700 leading-relaxed">
             Use the portal to submit a &quot;Host a Drive&quot; request. We will assign a dedicated account manager to you. They will handle the technical equipment, nursing staff, and medical supplies. You just need to provide the space and the donors!
           </p>
           <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Step 3: Recruit Donors</h3>
           <p className="mb-6 text-slate-700 leading-relaxed">
             This is your main job. Use social media, flyers, and word of mouth. Aim for at least 30 committed donors to make the drive viable. LifeFlow provides marketing materials to help you spread the word.
           </p>
        </>
    )
  },
  {
    id: '5',
    title: "The Surprising Health Perks of Donating Blood",
    excerpt: "Did you know regular donation can improve your heart health and reduce iron overload? Read about the science behind the donor benefits.",
    date: 'Oct 10, 2025',
    author: 'Medical Board',
    category: 'Science',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop',
    tags: ['Health', 'Research', 'Benefits'],
    content: (
        <>
            <p className="lead text-xl text-slate-600 mb-8 leading-relaxed">
                Altruism is its own reward, but did you know donating blood might actually be good for <em>you</em> too? While the primary beneficiary is the recipient, research suggests regular donors may enjoy several health benefits.
            </p>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Cardiovascular Health</h3>
            <p className="mb-6 text-slate-700 leading-relaxed">
                High levels of iron in the blood can accelerate oxidation of cholesterol, potentially damaging arteries. By donating regularly, you lower your iron stores to a healthier level, which some studies link to a reduced risk of heart attacks and strokes, particularly in men.
            </p>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Free Mini-Physical</h3>
            <p className="mb-6 text-slate-700 leading-relaxed">
                Before every donation, you receive a health checkup. We measure your:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-8 text-slate-700 ml-4">
                <li>Pulse</li>
                <li>Blood Pressure</li>
                <li>Body Temperature</li>
                <li>Hemoglobin Levels</li>
            </ul>
            <p className="mb-6 text-slate-700 leading-relaxed">
                This regular monitoring can act as an early warning system for underlying health issues like hypertension or anemia, often catching them before they become serious problems.
            </p>
        </>
    )
  },
  {
    id: '6',
    title: "First Time? Here is What to Expect",
    excerpt: "Nervous about your first time? Don't be! We walk you through exactly what to expect, from registration to the cookies afterwards.",
    date: 'Oct 05, 2025',
    author: 'Admin',
    category: 'Wellness',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop',
    tags: ['Guide', 'Beginner', 'Tips'],
    content: (
        <>
            <p className="lead text-xl text-slate-600 mb-8 leading-relaxed">
                It is normal to be nervous. The fear of the unknown—or needles—stops many people from giving. But knowing exactly what happens can make all the difference.
            </p>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">1. Registration (10-15 mins)</h3>
            <p className="mb-6 text-slate-700 leading-relaxed">
                You&apos;ll sign in, show your ID, and answer a confidential questionnaire about your health and travel history to ensure donation is safe for you and the recipient.
            </p>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">2. The Screening (5-10 mins)</h3>
            <p className="mb-6 text-slate-700 leading-relaxed">
                A staff member will check your vitals (temperature, pulse, blood pressure) and prick your finger to check your iron levels. It&apos;s a quick pinch!
            </p>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">3. The Donation (8-10 mins)</h3>
            <p className="mb-6 text-slate-700 leading-relaxed">
                You&apos;ll sit in a comfortable chair. The phlebotomist will clean your arm and insert the needle. You&apos;ll feel a quick pinch, but it passes instantly. You can read, listen to music, or chat while the bag fills. It typically takes less than 10 minutes for a pint of whole blood.
            </p>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">4. Refreshments (15 mins)</h3>
            <p className="mb-6 text-slate-700 leading-relaxed">
                The best part! You&apos;ll move to the canteen area to have a drink and a snack. This helps restore your fluid levels. After 15 minutes, you&apos;re free to go about your day, knowing you just saved lives.
            </p>
        </>
    )
  }
];
