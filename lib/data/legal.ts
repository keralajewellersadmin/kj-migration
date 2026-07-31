// Structured legal-page content extracted from the reference site (E:\Kerala-Jewellers-final).
// T&C and Privacy text reproduced to match the reference. The GRT Jewellers contact email in the
// Privacy Policy was corrected to Kerala Jewellers' own address (see note in extract_legal step).

export type LegalBlock =
  { type: "p"; text: string } | { type: "ul"; items: string[] };
export type LegalSection = { title: string; blocks: LegalBlock[] };

export const termsSections: LegalSection[] = [
  {
    title: "",
    blocks: [
      {
        type: "p",
        text: "These terms and conditions apply to the Kerala Jewellers showroom sale & online sale, website located at www.keralajewellers.com and other branches shown in the contact us page.",
      },
      {
        type: "p",
        text: "Please read these terms and conditions (the Terms and Conditions) carefully. BY USING THE SITE, YOU AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS. These Terms and Conditions govern your use of, and any purchase from, the Kerala Jewellers Site, and constitute an agreement between you and Kerala Jewellers. KERALA JEWELLERS RESERVES THE RIGHT TO CHANGE OR MODIFY ANY OF THESE TERMS AND CONDITIONS OR ANY POLICY OR GUIDELINE OF THE SITE AT ANY TIME, AND IN ITS SOLE DISCRETION. Any change or modification will be effective immediately upon posting of the revisions on the Site. Your continued use of the Site following the posting of its changes or modifications will constitute your acceptance of such changes or modifications. Therefore, you should frequently review these Terms and Conditions and any other applicable policies from time-to-time to understand the terms and conditions that apply to your use of the Site. If you do not agree to the amended terms, you must stop using the Site.",
      },
    ],
  },
  {
    title: "Product Availability and Pricing",
    blocks: [
      {
        type: "p",
        text: "If youre interested in a piece of jewellery that is currently on back order, we will call you and update you when the item will be back in stock. Sometimes with the volume of orders we receive, an item may go out of stock before we are able to post a notification on the Site. If this happens, we will contact you directly to discuss possible options.",
      },
      {
        type: "p",
        text: "Data, including prices, may be inaccurately displayed on our Site due to system or typographical errors. While we make every attempt to avoid these errors, they may occur. We reserve the right to correct any and all errors when they do occur, and we do not honour inaccurate or erroneous prices. If a products listed price is lower than its actual price, we will, at our discretion, either contact you for instructions before shipping the product or cancel the order and notify you of such cancellation. If the order has been shipped, you agree to either return the product or pay the difference between the actual and charged prices. Our prices are also subject to change without prior notice. We apologize for any inconvenience that this may cause. If you have any questions, please do not hesitate to contact one of our Customer care Executives at pondybazaar@keralajewellers.in or",
      },
      {
        type: "p",
        text: "+91 44 6536 3322, +91 6536 3322, +91 2343 8967, +91 2343 7813.",
      },
      {
        type: "p",
        text: "We do not negotiate prices on our products and all our prices are final.",
      },
    ],
  },
  {
    title: "Information on our Site",
    blocks: [
      {
        type: "p",
        text: "At Kerala Jewellers, we make every attempt to ensure that our online catalogue is as accurate and complete as possible. In order to give you the opportunity to view our products in great detail, some products may appear larger or smaller than their actual size in our photographs; and since every computer monitor is set differently, colour and size may vary slightly.",
      },
      {
        type: "p",
        text: "Our objective is to provide you with as much information and detail about your prospective purchase as possible so that you can see the beauty and shape of a particular item. In compliance with industry standards and BIS (Bureau of Indian Standards) regulations, Kerala Jewellers states that product total weight in all purchases may vary 0.05 grams from stated weight.",
      },
      {
        type: "p",
        text: "On the Site, we may provide the measurement of our products based on our manufacturing specifications. Slight tolerances may be accounted for based on finishing during the manufacturing.",
      },
      {
        type: "p",
        text: "For diamond jewellery set with multiple shape and size, we provide the minimum total carat weight for the piece. Color and clarity grades are expressed as either a minimum or an average depending on the number of diamonds. If stated as a minimum, all diamonds within the piece are at or above the stated quality. If expressed as an average, collectively the quality is equal to or exceeds the grade stated.",
      },
    ],
  },
  {
    title: "Privacy Policy",
    blocks: [
      {
        type: "p",
        text: "Please refer to our Privacy Policy for further information.",
      },
    ],
  },
  {
    title: "Site Content",
    blocks: [
      {
        type: "p",
        text: "The Site and all content and other materials including, without limitation, the Kerala Jewellers logo, and all designs, text, graphics, pictures, selection, coordination, look and feel, information, data, software, audio files, video files, other files and the selection and arrangement thereof (collectively, the Site Materials) are the proprietary property of Kerala Jewellers are protected by trade dress, copyright, patent and trademark laws, and various other intellectual property rights and unfair competition laws.",
      },
    ],
  },
  {
    title: "Kerala Jewellers",
    blocks: [
      {
        type: "p",
        text: "Kerala Jewellers, Diamonds, Silver Line, Platinum bare the Kerala Jewellers logos, and any other product or service name or slogan contained in our Site are trademarks of Kerala Jewellers and its suppliers or licensors, and may not be copied, imitated or used, in whole or in part, without the prior written permission of Kerala Jewellers or the applicable trademark holder. You may not use any meta tags or any other hidden text utilizing Kerala Jewellers or any other name, trademark or product or service name of Kerala Jewellers without our prior written permission.",
      },
    ],
  },
  {
    title: "Kindly contact our customer care for further details",
    blocks: [
      {
        type: "ul",
        items: [
          "+91 44 6536 3322, +91 6536 3322, +91 2343 8967, +91 2343 7813",
          "email at pondybazaar@keralajewellers.in",
        ],
      },
    ],
  },
  {
    title: "Return Policy",
    blocks: [],
  },
  {
    title: "30 Day Exchange and Money Back Policy",
    blocks: [
      {
        type: "p",
        text: "Kerala Jewellers offers a hassle-free 30 day exchange and money back policy. If for any reason you are not satisfied with the product, we will happily provide you with a 100% Exchange or refund on the Invoice value. You can return any of our products except for Non Exchangeable products and Gold Coins within 30 days of receiving the product. We offer FREE return shipping within the 30 day exchange Policy. The value of the product being returned should not exceed Rs.1, 00,000/- in case of Jewellery and Rs.3, 00,000/- in case of Temple Jewellery and Solitaires...more",
      },
    ],
  },
  {
    title: "To cancel an order",
    blocks: [
      {
        type: "p",
        text: "To cancel an order, please send an email to pondybazaar@keralajewellers.in within the same days from order confirmation. Please include the order ID in the subject line. EX: Order Cancellation.",
      },
    ],
  },
  {
    title: "Use of the Site",
    blocks: [
      {
        type: "p",
        text: "You are granted a personal, limited, non-sub licensable license to access and use our Site and electronically copy, (except where prohibited without a license) and print to hard copy portions of our Site Materials for your informational, non-commercial and personal use only. Such license is subject to these Terms and Conditions and does not include: (a) any resale or commercial use of our Site or the Site Materials therein; (b) the collection and use of any product listings, pictures or descriptions for commercial purposes; (c) the distribution, public performance or public display of any Site Materials, (d) modifying or otherwise making any derivative uses of our Site and the Site Materials, or any portion thereof; (e) use of any automated means to access, monitor or interact with any portion of our Site, including through data mining, robots, spiders, scraping, or similar data gathering or extraction methods; (f) downloading (other than the page caching) of any portion of our Site, the Site Materials or any information contained therein, except as expressly permitted on our Site; (g) cause to appear any pop-up, pop-under, exit windows, expanding buttons, banners, advertisement, or anything else which minimizes, covers, or frames or inhibits the full display of our Site; (h) use our web sites in any way which interferes with the normal operation of our sites; or (i) any use of our Site or the Site Materials other than for its intended purpose. Any use of our Site or the Site Materials other than as specifically authorized herein, without the prior written permission of Kerala Jewellers, is strictly prohibited and will terminate the license granted herein. Such unauthorized use may also violate applicable laws, including without limitation copyright and trademark laws and applicable communications regulations and statutes. Unless explicitly stated herein, nothing in these Terms and Conditions shall be construed as conferring any license to intellectual property rights, whether by estoppel, implication, or otherwise. This license is revocable at any time.",
      },
    ],
  },
  {
    title: "Infringer Policy",
    blocks: [
      {
        type: "p",
        text: "In accordance with The Indian Copyright Act (ICA) and other applicable law, Kerala Jewellers has adopted a policy of terminating and barring, in appropriate circumstances and at Kerala Jewellers sole discretion, site users or account holders who are deemed to be repeat infringers. Kerala Jewellers may also at its sole discretion limit access to this site and/or terminate the accounts of any users who infringe any intellectual property rights of others, whether or not there is any repeat infringement.",
      },
    ],
  },
  {
    title: "Third Party Content",
    blocks: [
      {
        type: "p",
        text: "Kerala Jewellers may provide links to Web pages and content of third parties (Third Party Content) as a service to those interested in this information. Kerala Jewellers does not monitor or have any control over any Third Party Content or third party Sites. Kerala Jewellers does not endorse any Third Party Content and can make no guarantee as to its accuracy or completeness. Kerala Jewellers does not represent or warrant the accuracy of any information contained therein, and undertakes no responsibility to update or review any Third Party Content. Users use these links and Third Party Content contained therein at their own risk.",
      },
    ],
  },
  {
    title: "Product Reviews and User Content",
    blocks: [
      {
        type: "p",
        text: "Our Site includes a product review feature, and includes or may include in the future discussion forums, user-generated content, or other areas or services in which you or third parties create, post, or store any content, messages, materials or other items on our Site (Interactive Areas). You are solely responsible for your use of such Interactive Areas and use them at your own risk. By using any Interactive Areas, you agree not to post, upload to, transmit, distribute, store, create or otherwise publish through our Site any of the following:",
      },
      {
        type: "ul",
        items: [
          "Any message, data, information, text, music, sound, photos, video, graphics, code or other material ('User Content') that is unlawful, libellous, defamatory, obscene, pornographic, indecent, lewd, suggestive, harassing, threatening, invasive of privacy or publicity rights, abusive, inflammatory, fraudulent or otherwise objectionable.",
          "User Content that would constitute, encourage or provide instructions for a criminal offense, violate the rights of any party, or that would otherwise create liability or violate any local, state, national or international law, including, without limitation, the regulations of the INDIAN Securities and Exchange Commission or any rules of a securities exchange such as the Mumbai Stock Exchange or The National Stock Exchange (NSE).",
          "User Content that may infringe any patent, trademark, trade secret, copyright or other intellectual or proprietary right of any party. By posting any User Content, you represent and warrant that you have the lawful right to distribute and reproduce such User content.",
          "User Content that impersonates any person or entity or otherwise misrepresents your affiliation with a person or entity",
          "Unsolicited promotions, political campaigning, advertising or solicitations.",
          "Private information of any third party, including, without limitation, addresses, phone numbers, email addresses and credit card numbers.",
          "Viruses, corrupted data or other harmful, disruptive or destructive files; and user Content that, in the sole judgment of Kerala Jewellers, is objectionable or which restricts or inhibits any other person from using or enjoying the Interactive Areas or our Site, or which may expose Kerala Jewellers or its users to any harm or liability of any type.",
        ],
      },
      {
        type: "p",
        text: "Kerala Jewellers takes no responsibility and assumes no liability for any User Content posted, stored or uploaded by you or any third party, or for any loss or damage thereto, nor is Kerala Jewellers liable for any mistakes, defamation, slander, libel, omissions, falsehoods, obscenity, pornography or profanity you may encounter. Your use of Interactive Areas is at your own risk. As a provider of interactive services, Kerala Jewellers is not liable for any statements, representations or User Content provided by its users in any public forum, personal home page or other Interactive Area. Although Kerala Jewellers has no obligation to screen, edit or monitor any of the Content posted in any Interactive Area, Kerala Jewellers reserves the right, and has absolute discretion, to remove, screen or edit any User Content posted or stored on our Site at any time and for any reason without prior notice, and you are solely responsible for creating backup copies of and replacing any User Content you post or store on our Site at your sole cost and expense. Any use of the Interactive Areas or other portions of our Site in violation of the foregoing violates these Terms and Conditions and may result in, among other things, termination or suspension of your rights to use the Interactive Areas and / or our Site. In order to cooperate with legitimate governmental requests, subpoenas or court orders, to protect Kerala Jewellers systems and customers, or to ensure the integrity and operation of Kerala Jewellers business and systems, Kerala Jewellers may access and disclose any information it considers necessary or appropriate, including, without limitation, user profile information (i.e. name, Postal address, e-mail address, etc.), IP addressing and traffic information, usage history, and posted User Content. Kerala Jewellers right to disclose any such information shall govern over any terms of Kerala Jewellers Privacy Policy. If you post User Content to our Site, unless we indicate otherwise, you grant Kerala Jewellers and its affiliates a nonexclusive, royalty-free, perpetual, and irrevocable and fully sub licensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform and display such User Content throughout the world in any media. You grant Kerala Jewellers and its affiliates and sub licensees the right to use the name that you submit in connection with such content, if they choose. You represent and warrant that (a) you own and control all of the rights to the User Content that you post or you otherwise have the right to post such User Content to our Site; (b) the User Content is accurate and not misleading; and (c) use and posting of the User Content you supply does not violate these Terms and Conditions and will not violate any rights of or cause injury to any person or entity.",
      },
    ],
  },
  {
    title: "Indemnification",
    blocks: [
      {
        type: "p",
        text: "You agree to defend, indemnify and hold harmless Kerala Jewellers, its independent contractors, service providers and consultants, and their respective directors, employees and agents, from and against any claims, damages, costs, liabilities, and expenses (including, but not limited to, reasonable attorneys' fees) arising out of or related to any Content you post, store or otherwise transmit on or through our Site or your use of or inability to use our Site, including without limitation any actual or threatened suit, demand or claim made against Kerala Jewellers and/or its independent contractors, service providers, employees, directors or consultants, arising out of or relating to the Content, your conduct, your violation of these Terms and Conditions or your violation of the rights of any third party.",
      },
    ],
  },
  {
    title: "Disclaimer of Warranty",
    blocks: [
      {
        type: "p",
        text: 'Except as expressly provided to the contrary in a writing by Kerala Jewellers, this site, the content contained therein and the products and services provided on or in connection therewith (the "products and services") are provided on an "as is" basis without warranties of any kind, either express or implied. Kerala Jewellers disclaims all other warranties, express or implied, including, without limitation, implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement as to the information, content, and materials in our site. Kerala Jewellers does not represent or warrant that materials in our site or the services are accurate, complete, reliable, current or error-free. Kerala Jewellers does not represent or warrant that our site or its servers are free of viruses or other harmful components.',
      },
    ],
  },
  {
    title: "Limitation of Liability",
    blocks: [
      {
        type: "p",
        text: "In no event shall Kerala Jewellers, its directors, members, employees or agents be liable for any direct, special, indirect, or consequential damages, or any other damages of any kind, including but not limited to loss of use, loss of profits, or loss of data, whether in an action in contract, tort (including but not limited to negligence) or otherwise, arising out of or in any way connected with the use of our site, the products and services, or the content contained in or accessed through our site, including without limitation any damages caused by or resulting from reliance by user on any information obtained from Kerala Jewellers, or that result from mistakes, omissions, interruptions, deletion of files or email, errors, defects, viruses, delays in operation or transmission or any failure of performance, whether or not resulting from acts of god, communications failure, theft, destruction or unauthorized access to Kerala Jewellerss records, programs or services.",
      },
    ],
  },
  {
    title: "Applicable Law and Venue",
    blocks: [
      {
        type: "p",
        text: "These Terms and Conditions and your use of this site will be governed by and construed in accordance with the laws of the State of Tamil Nadu, India, applicable to agreements made and to be entirely performed within the State of Tamil Nadu, without resort to its conflict of law provisions. You agree that any action at law or in equity arising out of or relating to these Terms and Conditions shall be filed only in the state and Central courts located in the County, Tamil Nadu and you hereby irrevocably and unconditionally consent and submit to the exclusive jurisdiction of such courts over any suit, action or proceeding arising out of your use of this site, any purchase from this site, or these Terms and Conditions.",
      },
    ],
  },
  {
    title: "Modification and Notice",
    blocks: [
      {
        type: "p",
        text: "You agree that Kerala Jewellers may modify, remove these Terms and Conditions and any other policies on our Site at any time and that posting the modified Terms and Conditions or policies on our Site will constitute sufficient notice of such modification.",
      },
    ],
  },
  {
    title: "Termination",
    blocks: [
      {
        type: "p",
        text: "Notwithstanding any of these Terms and Conditions, Kerala Jewellers reserves the right, without notice and in its sole discretion, to terminate your license to use this site, and to block or prevent future your access to and use of the Site.",
      },
    ],
  },
  {
    title: "Severability",
    blocks: [
      {
        type: "p",
        text: "If any provision of these Terms and Conditions shall be deemed unlawful, void or for any reason unenforceable, then that provision shall be deemed severable from these Terms and Conditions and shall not affect the validity and enforceability of any remaining provisions.",
      },
    ],
  },
  {
    title: "Questions & Contact Information",
    blocks: [
      {
        type: "p",
        text: "If you have any questions, please do not hesitate to contact us via mobile at +91 95660 11899, +91 93810 11742, +91 74488 42244 or email us at pondybazaar@keralajewellers.in or visit us at our other branches in Pondy Bazaar, Purasaiwalkam or Porur.",
      },
    ],
  },
];

export const swarnavarshaSections: LegalSection[] = [
  {
    title: "",
    blocks: [
      {
        type: "p",
        text: "The monthly advance against purchase of jewellery must be uniform and paid continuously (for eleven months) with a minimum of Rs.1000/-, the advance payments cannot be extended beyond 11th month and is not transferable under any circumstance.",
      },
      {
        type: "p",
        text: "On completion of eleven months from the date of enrolment the customer will be eligible to purchase the chosen jewellery without Value addition (VA) under Swarnavarsha Advance Gold Purchase Plan. Customers can choose any jewellery including Gold coin limited to the accumulated value or the accumulated Gold weight.",
      },
      {
        type: "p",
        text: "This advance against purchase of jewellery is unique and cannot be clubbed with any other existing schemes / offers.",
      },
      {
        type: "p",
        text: "The monthly advance against purchase of jewellery must be paid by the 15th of every month and monthly advance against purchase of jewellery can neither be paid in advance nor carried over, the advance amounts paid will not be eligible for any interest.",
      },
      {
        type: "p",
        text: "Jewellery can be purchased only after 30 days from the date of last advance payment paid.",
      },
      {
        type: "p",
        text: "As and when advance payments are made, the amount of advance payment will be converted into weight of gold at the prevailing selling rate of 22kt or the amount of money as paid. Gold rate notified by the Madras Jewellers Association.",
      },
      {
        type: "p",
        text: "In case of premature closing before three advance payments, the nominal amount of 10% on first advance payment will be deducted as administrative charges.",
      },
      {
        type: "p",
        text: "In case of change in address, loss of advance receipt book, the customer should inform the company immediately and apply for new advance receipt book with KYC details.",
      },
      {
        type: "p",
        text: "No more than one advance payment can be made in a month and also the plan cannot be extended beyond the stipulated period.",
      },
      {
        type: "p",
        text: "Advance against purchase of jewellery can be made in cash, credit/debit card, NEFT, UPI, local cheques favouring the company, bank charges will be borne by the customers (In case of cheque dishonour). Your receipt for having paid the advance money will be advised to you by SMS or Email.",
      },
      {
        type: "p",
        text: "After purchase of jewellery on maturity, if any balance is left over it will not be refunded by cash. It can only be adjusted on additional purchase of Gold Coin.",
      },
      {
        type: "p",
        text: "The customers will be eligible for NO Value addition (VA) on purchase only after he or she has paid all the advance payments promptly.",
      },
      {
        type: "p",
        text: "The customer will not be able to continue the plan in the event of default in the monthly advance payments. Hence it is mandatory that the customer pay the advance payments promptly every month without fail.",
      },
      {
        type: "p",
        text: "Making charges & Stone charges will be charged according to the type of jewellery purchased and Value Addition (VA) will be charged for special jewellery accordingly like Diamond, Platinum, Uncut diamonds, Antique Jewellery, Ruby & Emerald.",
      },
      {
        type: "p",
        text: "When the customer purchases jewellery in excess of accumulated amount or in excess of accumulated Gold weight, the Value addition (VA) as applicable will be borne by the customer for the excess amount / weight.",
      },
      {
        type: "p",
        text: "GST and any other Government levies at the time of delivery will be borne by the customer.",
      },
      {
        type: "p",
        text: "The customers signature will be verified at the time of redemption of the plan. The advance receipt book should be surrendered at the time of purchase of jewellery.",
      },
      {
        type: "p",
        text: "Company has its sole discretion can alter, amend, modify, add or delete any of the terms and conditions from time to time with or without any prior notice.",
      },
      {
        type: "p",
        text: "Kerala Jewellers reserves all rights to alter amend, add or delete part of whole of the privileges of the scheme with or without prior notice. Kerala Jewellers is the sponsor of the scheme and reserves the right to suspend the scheme at any time. In such event, the member may purchase any item at the store equal to weight value of money accumulated in the account as on that day.",
      },
      {
        type: "p",
        text: "All disputes are subject to the jurisdiction of the competent courts in Chennai.",
      },
    ],
  },
];

export const thangaMazhaiTerms: string[] = [
  "The monthly advance against purchase of jewellery must be uniform and paid continuously (for eleven months) with a minimum of Rs.1000/-, the advance payments cannot be extended beyond 11th month and is not transferable under any circumstance.",
  "On completion of eleven months from the date of enrolment the customer will be eligible to purchase the chosen jewellery without Value addition (VA) under Swarnavarsha Advance Gold Purchase Plan. Customers can choose any jewellery including Gold coin limited to the accumulated value or the accumulated Gold weight.",
  "This advance against purchase of jewellery is unique and cannot be clubbed with any other existing schemes / offers.",
  "The monthly advance against purchase of jewellery must be paid by the 15th of every month and monthly advance against purchase of jewellery can neither be paid in advance nor carried over, the advance amounts paid will not be eligible for any interest.",
  "Jewellery can be purchased only after 30 days from the date of last advance payment paid.",
  "As and when advance payments are made, the amount of advance payment will be converted into weight of gold at the prevailing selling rate of 22kt or the amount of money as paid. Gold rate notified by the Madras Jewellers Association.",
  "In case of premature closing before three advance payments, the nominal amount of 10% on first advance payment will be deducted as administrative charges.",
  "In case of change in address, loss of advance receipt book, the customer should inform the company immediately and apply for new advance receipt book with KYC details.",
  "No more than one advance payment can be made in a month and also the plan cannot be extended beyond the stipulated period.",
  "Advance against purchase of jewellery can be made in cash, credit/debit card, NEFT, UPI, local cheques favouring the company, bank charges will be borne by the customers (In case of cheque dishonour). Your receipt for having paid the advance money will be advised to you by SMS or Email.",
  "After purchase of jewellery on maturity, if any balance is left over it will not be refunded by cash. It can only be adjusted on additional purchase of Gold Coin.",
  "The customers will be eligible for NO Value addition (VA) on purchase only after he or she has paid all the advance payments promptly.",
  "The customer will not be able to continue the plan in the event of default in the monthly advance payments. Hence it is mandatory that the customer pay the advance payments promptly every month without fail.",
  "Making charges & Stone charges will be charged according to the type of jewellery purchased and Value Addition (VA) will be charged for special jewellery accordingly like Diamond, Platinum, Uncut diamonds, Antique Jewellery, Ruby & Emerald.",
  "When the customer purchases jewellery in excess of accumulated amount or in excess of accumulated Gold weight, the Value addition (VA) as applicable will be borne by the customer for the excess amount / weight.",
  "GST and any other Government levies at the time of delivery will be borne by the customer.",
  "The customers signature will be verified at the time of redemption of the plan. The advance receipt book should be surrendered at the time of purchase of jewellery.",
  "Company has its sole discretion can alter, amend, modify, add or delete any of the terms and conditions from time to time with or without any prior notice.",
  "Kerala Jewellers reserves all rights to alter amend, add or delete part of whole of the privileges of the scheme with or without prior notice. Kerala Jewellers is the sponsor of the scheme and reserves the right to suspend the scheme at any time. In such event, the member may purchase any item at the store equal to weight value of money accumulated in the account as on that day.",
  "All disputes are subject to the jurisdiction of the competent courts in Chennai.",
];

export const privacySections: LegalSection[] = [
  {
    title: "",
    blocks: [
      {
        type: "p",
        text: "Thank you for visiting Kerala Jewellers. We want you to know that your privacy is important to us. Our customers are at the heart of everything we do, and we strive to ensure your experience with Kerala Jewellers is one that you will want to repeat and share with your friends. Part of our commitment to you is to respect and protect the privacy of the personal information you provide to us. The information below is designed to inform you of what information we collect, why we collect such information, and how we use the information we collect. This Privacy Policy is incorporated into our Terms of Service.",
      },
      {
        type: "p",
        text: "When you submit your personal information to us, you are giving us your consent to the collection, use, and disclosure of your information as set forth in this Privacy Policy. We are always available to discuss your questions or concerns regarding this Privacy Policy and our privacy practices. If you would like to speak to a customer service representative, please contact us.",
      },
    ],
  },
  {
    title: "Information We Collect",
    blocks: [
      {
        type: "p",
        text: "We may collect personal information such as your name, email address, postal address, phone number, credit card number, gender, birthday, personal interests, etc., when you visit our Website, place an order online or by phone, save your information with us online, contact us with a question or concern, or participate in a contest, promotion, or survey.",
      },
    ],
  },
  {
    title: "Use of Your Personal Information",
    blocks: [
      {
        type: "p",
        text: "We may use the information we collect about you to:",
      },
      {
        type: "ul",
        items: [
          "Facilitate your purchases and provide the services you request",
          "Confirm and track your order",
          "Respond to your inquiries and requests",
          "Compare and review your personal information for errors, omissions and accuracy",
          "Prevent and detect fraud or abuse",
          "Improve our Website, service, product offerings, marketing and promotional efforts, and overall customer experience",
          "Identify your product and service preferences",
          "Understand our customer demographics, preferences, interests, and behaviour, and contact you regarding products and services that we believe may be of interest to you.",
        ],
      },
    ],
  },
  {
    title: "Personal Information That We May Share With Others",
    blocks: [
      {
        type: "p",
        text: "In certain circumstances, we may share your personal information with trusted partners:",
      },
      {
        type: "ul",
        items: [
          "Service Providers: We use trusted third-party service providers to perform certain services on our behalf, including: shipping, payment processing, data storage/management, web hosting, web analytics, fulfillment, assembly, marketing, mailing, emailing, etc.",
          "Special Events: If you choose to participate in a special event, Kerala Jewellers may share your personal information with those organizations participating in the applicable event.",
          "Compliance with Law and Fraud Protection: We may, and you authorize us to use and disclose any information, including personal information, we deem necessary to comply with any applicable law or to investigate, prevent or take action regarding illegal activities.",
        ],
      },
    ],
  },
  {
    title: "Other Uses of Your Information",
    blocks: [
      {
        type: "p",
        text: "IP Address: When you visit our Website, Kerala Jewellers collects your IP address to help diagnose problems with its server, administer and tune the operation of its Website, analyze trends, track traffic patterns, gather demographic information for aggregate use, and track the date and duration of each session within our Website.",
      },
      {
        type: "p",
        text: "Data Collection Devices: In some instances, Kerala Jewellers may collect data through cookies, web logs, web beacons and other monitoring technologies to enhance your browsing and shopping experience on our website.",
      },
    ],
  },
  {
    title: "Accessing and Updating Your Information",
    blocks: [
      {
        type: "p",
        text: "If the personally identifiable information Kerala Jewellers has gathered from you changes or you would like to access, correct, or delete such information, we will gladly provide you access to, correct, or delete any personal information we have collected about you. To request access to, a correction to, or deletion of your personal information, please send an e-mail to kjpurasai@gmail.com or contact one of our diamond and jewellery consultants.",
      },
    ],
  },
  {
    title: "Choice/Opt-Out",
    blocks: [
      {
        type: "p",
        text: "We want to communicate with you only if you want to continue to hear from us. Write to Customer Service at Kerala Jewellers, #34, Pondy Bazaar (below Big Bazaar) T-Nagar, Chennai 600 017 or with any other branches in Purasaiwakkam or Porur as shown in contact us page.",
      },
    ],
  },
];
