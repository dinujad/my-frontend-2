// SEO content for product category pages, keyed by category slug.
// Rendered on page 1 of /product-category/[slug] below the product grid:
// an intro block, a buying guide and a visible FAQ section (with FAQPage
// JSON-LD). Written for the P1 SEO expansion (Oct 2026) — category pages
// previously carried only a one-line description.

export interface CategoryFaq {
  q: string;
  a: string;
}

export interface CategorySection {
  heading: string;
  paragraphs: string[];
}

export interface CategoryContent {
  intro: string;
  sections: CategorySection[];
  faqs: CategoryFaq[];
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  "uv-flatbed-printing": {
    "intro": "UV Flatbed Printing in Sri Lanka — direct, high-quality printing onto acrylic, wood, metal, glass and ceramics for signage, displays and custom pieces. Unlike paper printing, UV flatbed printing cures ink directly onto rigid surfaces, giving a durable finish with sharp detail and vivid colour. It is a popular choice for businesses, event organisers and homeowners who want crisp graphics on materials that go far beyond paper. From branded acrylic panels to printed wooden signs and glass décor, every piece is produced to order at our Biyagama facility.",
    "sections": [
      {
        "heading": "What's in the range",
        "paragraphs": [
          "The UV flatbed printing range covers five product lines. UV DTF Printing – A3 Sheet produces detailed A3 transfer sheets for applying printed designs to a variety of surfaces. UV Printing on Acrylic is ideal for modern signage, display panels and branded décor with a clean, contemporary look. UV Printing on Glass & Ceramic suits decorative panels, glass signage and personalised ceramic pieces. UV Printing on Metal is a strong option for nameplates, industrial plates and long-lasting signs. UV Printing on Wood brings a natural, warm character to shop signs, plaques and decorative items. Together, these options cover most rigid-surface printing needs, from one-off custom pieces to repeat business orders. UV DTF sheets are especially handy when you want the same design applied across different objects, while direct printing gives the most seamless result on a single chosen material."
        ]
      },
      {
        "heading": "Materials, sizes and customisation",
        "paragraphs": [
          "UV flatbed printing works on flat, rigid substrates, and each product line is set up around its material. Artwork is printed at the size of your finished item, in full colour, directly from your design files. For the best results, supply artwork as a vector file (such as AI, EPS or PDF) or as a high-resolution image at the intended print size, with any text converted to outlines. Our team checks every file before printing and will flag anything that needs attention. Because each piece is produced individually, you can customise colours, text, logos and layouts freely rather than choosing from fixed templates. Both light and dark substrates are workable, and bold, high-contrast artwork tends to reproduce best on darker materials."
        ]
      },
      {
        "heading": "How to choose and order",
        "paragraphs": [
          "Start by choosing the surface that suits the job: acrylic for modern displays and signage, wood for a natural look, metal for plates and hard-wearing signs, glass or ceramic for decorative pieces. Think about where the finished item will live, so we can advise on the most suitable material. Ordering is straightforward: send us your artwork or logo, we confirm a proof with you before anything is printed, then we produce your order and arrange delivery across Sri Lanka. If you are unsure which option fits your project, share your idea with us and we will recommend the right product line. Many customers combine UV printing with our acrylic products or signage boards for a complete branded display — just mention it when you enquire."
        ]
      }
    ],
    "faqs": [
      {
        "q": "What is UV flatbed printing?",
        "a": "UV flatbed printing applies UV-curable inks directly onto rigid materials, which are then instantly cured with UV light. This gives sharp detail, strong colour and good adhesion on non-porous surfaces such as acrylic, glass and metal, with a durable, high-quality finish."
      },
      {
        "q": "What materials can be printed on?",
        "a": "We print on acrylic, wood, metal, glass and ceramics. We also offer UV DTF printing on A3 sheets, which lets you transfer detailed printed designs onto a variety of other surfaces. These sheets are supplied ready to apply to your chosen objects."
      },
      {
        "q": "What artwork do I need to provide?",
        "a": "Vector files such as AI, EPS or PDF are ideal, or a high-resolution image at the size you want printed, with text converted to outlines. We check every file before production and confirm a proof with you first."
      },
      {
        "q": "Can I order a single custom piece?",
        "a": "Yes. UV flatbed printing is produced to order, so single custom pieces and small runs are welcome alongside larger business orders. Contact us with your design and the material you have in mind — and if the piece will sit in direct sun or rain, mention it so we can suggest the most suitable material and finish."
      }
    ]
  },
  "custom-acrylic-products": {
    "intro": "Custom Acrylic Products in Sri Lanka — bespoke acrylic creations from Print Works, including display cubes, name plate holders, desk sign holders, donation boxes with a built-in lock, and L-shape stands. Acrylic is the material of choice for modern offices, retail counters and events: clear, professional and easy to brand with your logo. Every piece is made to order, cut and finished for a clean, polished look. Ideal for reception desks, exhibitions, restaurants and retail displays across Sri Lanka.",
    "sections": [
      {
        "heading": "What's in the range",
        "paragraphs": [
          "The custom acrylic range covers display, identification and collection needs. Acrylic Desk Sign Holders and Acrylic L Shape Stands present tabletop signs, menus and price cards neatly at counters and reception desks. Acrylic Display Cubes and Acrylic Product Display Stands showcase products in retail spaces and at exhibitions. Acrylic Name Plate Holder – \"A\" Shape / Removable Type displays desk name plates, with a removable design that makes updates simple. Acrylic Pockets and Folders hold brochures, menus and documents within easy reach. The Acrylic Donation Box – Built in Lock Series is designed for charity collections and donation drives, with a built-in lock for security. Acrylic Sandwich Panels are layered panels suited to signage and display inserts. Hotels, salons and clinics use name plate holders and desk sign holders for a tidy, professional front desk, while charities and schools rely on the lockable donation box for fundraising."
        ]
      },
      {
        "heading": "Sizes, shapes and customisation",
        "paragraphs": [
          "Every acrylic piece is made to order, so sizes and shapes can be tailored to your space and purpose rather than limited to standard dimensions. Your logo, text or branding can be added to most items through printing or engraving, turning a functional item into a branded one. The removable-type name plate holder lets you swap name cards without replacing the holder, and the donation box range includes a built-in lock series for secure collections. If you have a bespoke idea — a specific size, shape or configuration — share it with us and we will advise on what is possible. Text and logos are finished cleanly for easy reading at counter distance, and edges are smoothed for safe everyday handling."
        ]
      },
      {
        "heading": "How to choose and order",
        "paragraphs": [
          "Begin with the purpose: display cubes and product stands for showcasing items, desk sign holders and L-shape stands for tabletop messaging, name plate holders for desks and counters, pockets and folders for literature, and the lockable donation box for collections. Measure the space where the item will sit, so the size works in practice. Then send us your logo or artwork, confirm the proof we prepare, and we will produce your order for delivery across Sri Lanka. For unusual shapes or quantities, it helps to describe the setting — an exhibition booth, a restaurant counter or an office reception — so we can recommend the right option."
        ]
      }
    ],
    "faqs": [
      {
        "q": "Can I order a custom size or shape?",
        "a": "Yes. Our acrylic products are made to order, so sizes and shapes can be tailored to your requirements. Send us your dimensions or describe what you need — including the size of the space where the item will be used — and we will confirm what is possible before production."
      },
      {
        "q": "Can you add my company logo or branding?",
        "a": "Yes. Logos, text and branding can be added to most acrylic items through printing or engraving. Simply send your artwork with your order and we will include it in the proof for your approval."
      },
      {
        "q": "What is the built-in lock series on the donation box?",
        "a": "The Acrylic Donation Box – Built in Lock Series includes a built-in lock, making it suitable for charity collections, fundraising events and donation drives where the contents need to stay secure."
      },
      {
        "q": "What are acrylic sandwich panels used for?",
        "a": "Acrylic sandwich panels are layered panels used for signage and display inserts, where printed material is held neatly between clear acrylic layers for a clean, professional presentation."
      }
    ]
  },
  "sticker-printing-cutting": {
    "intro": "Sticker Printing & Cutting in Sri Lanka — custom stickers, laptop stickers, logo stickers, vinyl decals and short-run packaging labels from Print Works. Choose die-cut stickers cut precisely to your design's shape, or kiss-cut stickers that peel easily from the backing sheet. Perfect for branding, product packaging, laptops, vehicles and promotions, every order is printed to order and supplied ready to apply. Whether you need a handful of laptop stickers or a full set of branded packaging labels, short runs and custom shapes are no problem.",
    "sections": [
      {
        "heading": "What's in the range",
        "paragraphs": [
          "The sticker range covers branding, labelling and decoration. Custom Logo Stickers and Packaging Labels & Stickers are ideal for product packaging, sealing boxes and short-run product labels. Custom Laptop Stickers work for personal use, giveaways and brand promotion. Custom Vinyl Decals suit windows, walls and general signage. Custom Floor Stickers and Decals are used for in-store promotions and indoor wayfinding. Custom Vehicle Windscreen Stickers carry branding and messaging on car windscreens and fleet vehicles. Domed Epoxy Stickers feature a raised, glossy dome over the print for a premium badge or label look. Photoluminescent Stickers Printing produces glow-in-the-dark stickers for safety signage and novelty uses. Short-run packaging labels are a cost-effective way for small businesses to brand products professionally without committing to large print runs."
        ]
      },
      {
        "heading": "Materials, shapes and cutting options",
        "paragraphs": [
          "Stickers are printed in full colour from your artwork on quality vinyl stock, and can be cut to any custom shape that follows your logo or design. With die-cut stickers, each sticker is cut individually to its exact shape. With kiss-cut stickers, the sticker itself is cut while the backing sheet stays intact, so stickers peel off easily — handy for sheets of labels or giveaway stickers. Domed epoxy stickers add a clear resin dome over the printed design for a raised, durable finish. Photoluminescent stickers absorb light and glow in the dark, making them practical for safety and emergency signage as well as creative uses. If you need a specific shape — a logo outline, a circle or a rounded rectangle — die-cutting follows your design exactly, while kiss-cut sheets keep multiple stickers organised on one backing."
        ]
      },
      {
        "heading": "How to choose and order",
        "paragraphs": [
          "Match the sticker to where it will be used: floor stickers for short-term in-store promotions, logo stickers and kiss-cut sheets for packaging and giveaways, laptop stickers for personal and brand use, windscreen stickers for vehicles, and photoluminescent stickers where visibility in the dark matters. For artwork, vector files are ideal, or supply a high-resolution image of your design; tell us the shape and size you want. We confirm a proof before printing, then produce your stickers and deliver across Sri Lanka, ready to apply. For repeat orders — such as packaging labels you use every month — keep your artwork on file with us and reordering is quick."
        ]
      }
    ],
    "faqs": [
      {
        "q": "What is the difference between die-cut and kiss-cut stickers?",
        "a": "Die-cut stickers are cut individually to the exact shape of your design, with no backing left around them. Kiss-cut stickers are cut through the sticker material only, leaving the backing sheet intact, so they peel off easily — ideal for sheets of labels or promotional stickers."
      },
      {
        "q": "What are photoluminescent stickers used for?",
        "a": "Photoluminescent stickers glow in the dark after absorbing light. They are commonly used for safety and emergency signage, such as exit markers and warning labels, as well as for novelty and decorative applications."
      },
      {
        "q": "What are domed epoxy stickers?",
        "a": "Domed epoxy stickers have a clear resin dome applied over the printed design, creating a raised, glossy, three-dimensional effect. They give labels and badges a premium look and add an extra layer of protection to the print."
      },
      {
        "q": "How should I prepare my artwork for stickers?",
        "a": "Vector files such as AI, EPS or PDF give the sharpest results, especially for die-cut shapes that follow your design's outline. High-resolution images also work. Include the size and shape you want, and we will confirm a proof before printing. If you are unsure about your files, send what you have and we will check them and advise before production."
      }
    ]
  },
  "signage-boards": {
    "intro": "Signage Boards in Sri Lanka — retail, corporate, safety and wayfinding signage for indoor and outdoor use from Print Works. From shop boards and office name plates to directional signs and safety notices, we produce clear, professional signage that helps customers find you and understand your space. Every board is made to order with your text, logo and branding, finished for durability in Sri Lankan conditions. We work with shops, offices, factories, clinics and schools — producing everything from a single name plate to full sets of directional boards.",
    "sections": [
      {
        "heading": "What's in the range",
        "paragraphs": [
          "The signage range covers the main settings where boards are needed. Retail signage includes shop boards and promotional signage that draw customers in. Corporate signage covers office name plates, lobby signs and branded interior boards that present a professional image. Safety signage includes notices and warning boards for workplaces, factories and public areas. Wayfinding signage covers directional boards that guide visitors through buildings, car parks and premises. Within door signage, Changeable Door Name Plates let you update names without replacing the whole plate — practical for offices with changing staff or tenants. Vacant & Occupied Door Signs clearly show room status for meeting rooms, restrooms, clinics and consultation rooms. For larger premises, a consistent set of wayfinding boards — covering entrances, corridors, floors and exits — makes navigation effortless for visitors."
        ]
      },
      {
        "heading": "Materials, finishes and customisation",
        "paragraphs": [
          "We produce signage boards for both indoor and outdoor use, with materials and finishes chosen to suit where each board will be placed. Every board is customised with your text, logo and brand colours, printed for clear readability at the intended viewing distance. Changeable door name plates are designed so name inserts can be swapped easily, while vacant and occupied signs use a simple, instantly readable format. If you have existing brand guidelines, share them with your order and we will match the design accordingly. Mounting options such as wall fixing or freestanding display can be discussed when you place your order, depending on the board and its location. For boards that need to be seen after dark, mention this when you enquire so the right finish can be recommended."
        ]
      },
      {
        "heading": "How to choose and order",
        "paragraphs": [
          "Start with the setting and viewing distance: a shop board seen from the street needs large, bold lettering, while a desk name plate needs fine, crisp detail. Decide whether the board will be indoors or outdoors so the right materials are used. Confirm the exact text, logo and size, along with where the board will be mounted. Then send us your details, approve the proof we prepare, and we will produce your signage for delivery across Sri Lanka. For multi-sign projects — such as a full set of wayfinding boards for a building — it helps to list every sign and location so the set stays consistent. Allow time for proof approval in your planning, as production begins once you confirm the final design."
        ]
      }
    ],
    "faqs": [
      {
        "q": "What types of signage boards do you make?",
        "a": "We make retail, corporate, safety and wayfinding signage boards for indoor and outdoor use. This includes shop boards, office name plates, safety notices, directional boards, changeable door name plates and vacant & occupied door signs. Tell us your setting — a shop, an office, a factory or a public building — and we will recommend the right board types."
      },
      {
        "q": "What are changeable door name plates?",
        "a": "Changeable door name plates are door signs designed so the name insert can be swapped without replacing the whole plate. They are ideal for offices, clinics and buildings where occupants or staff change over time."
      },
      {
        "q": "What are vacant and occupied signs used for?",
        "a": "Vacant & occupied door signs show at a glance whether a room is free or in use. They are commonly used on meeting rooms, restrooms, consultation rooms and clinics to avoid interruptions."
      },
      {
        "q": "Can signage boards be used outdoors?",
        "a": "Yes. We produce signage for both indoor and outdoor use, selecting materials and finishes suited to each setting. Tell us where your board will be placed and we will recommend the right option for durability."
      }
    ]
  },
  "pvc-card-printing": {
    "intro": "PVC Card Printing in Sri Lanka — custom ID cards, membership cards, key cards and visitor passes printed by Print Works. We produce durable PVC cards for companies, schools, events and clubs, from corporate and student ID cards to event passes, key cards, membership cards, warranty cards and translucent PVC business cards. Each card is printed in full colour with your branding, names, photos or member details. Order the exact quantity you need, with consistent quality across every card in the batch.",
    "sections": [
      {
        "heading": "What's in the range",
        "paragraphs": [
          "Our PVC card range covers the cards organisations use every day. Corporate and student ID cards carry your logo alongside the holder's name, photo, designation and department, giving staff and students a professional identity they can wear with pride. Event ID cards and visitor passes keep check-in smooth and secure at conferences, exhibitions, weddings and functions, with clear identification for guests, crew and VIPs. Membership cards suit gyms, clubs, libraries and loyalty programmes, with member names, numbers and expiry dates printed on every card. Key cards are made for hotels, offices and secure areas, while PVC warranty cards give retailers and service centres a neat, long-lasting card to hand to customers. For a distinctive look, translucent PVC business cards stand out from standard paper cards while staying slim enough for any wallet."
        ]
      },
      {
        "heading": "Materials, sizes & customisation",
        "paragraphs": [
          "Every card in this range is printed on sturdy PVC, the standard material for cards that are handled every day — it resists bending, moisture and fading far better than paper. Cards are made in the standard wallet-friendly size that fits lanyards, badge holders and wallets. Printing is full colour on one or both sides, so you can put your branding and the holder's photo on the front and extra details on the back. Each card can be personalised with names, photographs, designations, member numbers or expiry dates, all printed crisply for easy reading. The translucent PVC business cards use a frosted, see-through plastic for a modern look that still feels professional. Tell us your layout and we will set it up exactly as you need it."
        ]
      },
      {
        "heading": "How to choose & ordering",
        "paragraphs": [
          "Start by deciding what the card has to do. For staff and students, ID cards with photos and designations work best; for events, choose passes that clearly show the holder's role — guest, crew or VIP — so your team can manage access at a glance. Membership and key cards suit ongoing use, while warranty cards are ideal for retailers who want a professional handout with every sale. Once you know the type, send us your logo and artwork, plus the names, photos or member details for personalisation — a simple spreadsheet works for large lists. We will prepare a proof for your approval before anything is printed, so you can check every spelling and layout. After you approve the proof, your cards go into production and are delivered across Sri Lanka or made ready for collection."
        ]
      }
    ],
    "faqs": [
      {
        "q": "What information can go on my PVC cards?",
        "a": "Your logo and brand colours, plus personalised details such as names, photographs, designations, member numbers and expiry dates. Anything that should appear on every card, like your company name or terms, is printed identically across the batch."
      },
      {
        "q": "Can you print different names on each card?",
        "a": "Yes. We personalise every card in your order with individual names, photos or member numbers from the list you provide. Each card is checked so the right details appear on the right card."
      },
      {
        "q": "What is a translucent PVC business card?",
        "a": "It is a business card printed on frosted, see-through plastic instead of paper. It has the same standard card size but a distinctive modern look that helps you stand out, while remaining durable enough for everyday use."
      },
      {
        "q": "Do you deliver PVC cards outside Colombo?",
        "a": "Yes. We deliver finished cards across Sri Lanka, and you can also collect your order from us. Packing is done carefully so your cards arrive in perfect condition."
      }
    ]
  },
  "badges-tags": {
    "intro": "Badges & Tags in Sri Lanka — engraved metal pin badges, acrylic name badges, key tags and promotional badges from Print Works. From staff name badges and company logo badges to event tags and electrical panel labels, we make badges for offices, factories, schools, events and retail. Choose engraved metal for a premium finish or colourful acrylic for a modern look, each made to carry your branding. Whether you need badges for daily wear or one-off promotions, every piece is finished to a professional standard.",
    "sections": [
      {
        "heading": "What's in the range",
        "paragraphs": [
          "Our badge range starts with the everyday essentials. Acrylic name badges give staff, teachers and event teams a clean, professional identity, printed with names, designations and your logo. Company logo badges and engraved metal pin badges add a premium touch for uniforms, blazers and corporate gifts — the engraved finish gives metal badges a sharp, lasting impression. For events and promotions, acrylic key tags, tokens and promotional badges work as memorable giveaways that keep your brand in people's hands — tokens are also handy for cloakrooms, draws and access control at busy venues. Acrylic bookmarks and coasters double as practical branded gifts for bookshops, cafés and corporate hampers, useful long after they are received. When every item carries the same logo and colours, even small pieces build a consistent, professional brand image. For industrial use, electrical panel labels and tags provide clear, durable identification for panels and equipment."
        ]
      },
      {
        "heading": "Materials, finishes & customisation",
        "paragraphs": [
          "Badges are made in two main materials. Acrylic badges are lightweight, colourful and versatile — ideal for name badges, key tags, coasters and promotional pieces, with your design printed in full colour. Metal pin badges are engraved for a refined, permanent finish that suits company logos and formal wear. Every badge is customised with your artwork: logos, names, titles or messages, reproduced crisply at small scale. Shapes and sizes are made to order, from classic rectangles and circles to fully custom outlines that follow your logo. Designs can be printed on one or both sides of acrylic pieces, and engraved metal badges can be colour-filled for extra contrast. If your badges must match existing branding, send a sample or a clear photo and we will match colours as closely as the material allows. Tell us how the badges will be used and we will recommend the material and finish that fits best."
        ]
      },
      {
        "heading": "How to choose & ordering",
        "paragraphs": [
          "Think about where the badge will be worn or used. Name badges for daily staff wear do best in lightweight acrylic; formal occasions and corporate gifts suit engraved metal. For promotions, pick something people will keep — key tags, coasters and bookmarks get used long after the event. Industrial labels need to stay legible in tough conditions, so clear engraving on durable material is the priority. Send us your logo and the text for each badge, and we will prepare a proof showing the layout, spelling and finish. For events, share your guest or staff list early so personalised badges are ready well before the day. Once you approve the proof, we produce your badges and deliver them across Sri Lanka or have them ready for collection."
        ]
      }
    ],
    "faqs": [
      {
        "q": "What is the difference between acrylic and metal badges?",
        "a": "Acrylic badges are light, colourful and printed in full colour — great for name badges, key tags and promotions. Metal pin badges are engraved for a premium, permanent finish, best for company logos, uniforms and formal occasions."
      },
      {
        "q": "Can each badge have a different name?",
        "a": "Yes. Name badges and tags can be personalised with individual names and designations from your list. We check every piece so the details are correct on each badge."
      },
      {
        "q": "Do you make badges in custom shapes?",
        "a": "Yes. Beyond standard rectangles and circles, we can cut badges to custom outlines — including shapes based on your logo. Send your design and we will advise on what works best at badge size."
      },
      {
        "q": "What are electrical panel labels used for?",
        "a": "They identify electrical panels and equipment clearly and durably in factories, buildings and workshops. The engraved finish stays legible in industrial conditions where paper or stickers would fail."
      }
    ]
  },
  "digital-printing": {
    "intro": "Digital Printing in Sri Lanka — flex banners, backlit displays, large-format stickers and one-way vision film printed by Print Works. From shopfront banners and event backdrops to window graphics and reusable magnet stickers, we handle digital and large-format printing for businesses of every size. Your designs are printed in vivid full colour at sizes that get noticed, on materials chosen for indoor or outdoor use. Whether it is a single banner or a full set of prints, we deliver sharp, professional results.",
    "sections": [
      {
        "heading": "What's in the range",
        "paragraphs": [
          "Flex banner printing is the workhorse of outdoor advertising — bold, weather-tough banners for shopfronts, hoardings, events and promotions, printed in vivid full colour at sizes that command attention. Backlit flex printing is made for lightboxes and illuminated signage — from shopping mall displays to building facades — so your message glows clearly after dark. Large format sticker printing covers everything from product labels and wall graphics to full-surface branding, cut to your required shape and size. One way vision sticker printing turns glass into advertising space: the graphic is visible from outside while visibility is kept from the inside, ideal for vehicle windows and shopfront glass. Magnet stickers give you reusable signage — easy to mount, remove and reposition. For prints that must endure handling and the elements, PP/PET synthetic paper printing offers a durable alternative to standard paper."
        ]
      },
      {
        "heading": "Materials, sizes & customisation",
        "paragraphs": [
          "Every job is printed in full colour from your artwork, at large-format scale and cut to your exact dimensions. Choose flex for outdoor banners, backlit film for illuminated displays, adhesive vinyl for stickers and window graphics, magnetic material for reusable signs, or PP/PET synthetic paper where extra durability is needed. Indoor prints prioritise sharp detail and rich colour; outdoor work uses materials made to stand up to sun and rain. If you are unsure which material suits your job, describe where the print will go and how long it needs to last, and we will recommend the right option. Tell us the viewing distance too — a display viewed up close needs finer detail than a roadside hoarding, and we will set up your artwork scale accordingly. Colours are matched to your brand files so the printed result looks like your design. Your branding and message are reproduced faithfully at any size."
        ]
      },
      {
        "heading": "How to choose & ordering",
        "paragraphs": [
          "Match the product to the placement. Outdoor promotions call for flex banners; illuminated signs need backlit flex; glass surfaces suit one-way vision stickers; short-term or movable signage is perfect for magnet stickers; and premium documents or harsh conditions call for PP/PET synthetic paper. Measure the space before you order — a banner that is too small disappears on a big wall, while an oversized one is hard to mount. Send us your artwork or logo, along with the size and quantity you need. We will share a proof for your approval before printing, so colours, text and layout are exactly right. Once approved, your prints go into production and are delivered across Sri Lanka or ready for collection. For recurring promotions, magnet stickers and synthetic paper prints can be stored and reused."
        ]
      }
    ],
    "faqs": [
      {
        "q": "What is the difference between flex banners and backlit flex?",
        "a": "Standard flex banners are printed for normal viewing in daylight and suit outdoor advertising. Backlit flex is printed on translucent material designed for lightboxes, so your graphic stays bright and readable after dark."
      },
      {
        "q": "What is one-way vision sticker printing?",
        "a": "It prints your design onto perforated film for glass surfaces. From outside, people see your full graphic; from inside, you can still see out. It is popular for vehicle windows and shopfront glass."
      },
      {
        "q": "Are magnet stickers reusable?",
        "a": "Yes. Magnet stickers have a magnetic backing, so they can be mounted, removed and repositioned without adhesive residue. They are a practical choice for temporary promotions and vehicle signage."
      },
      {
        "q": "When should I choose PP/PET synthetic paper?",
        "a": "Choose it when your print needs extra toughness — for example, prints handled frequently or exposed to moisture. It is a durable synthetic stock that lasts longer than standard paper in demanding conditions."
      }
    ]
  },
  "laser-cutting-engraving": {
    "intro": "Laser Cutting & Engraving in Sri Lanka — precision cutting and engraving on acrylic, wood, plywood and tile by Print Works. From custom signage and decorative panels to personalised gifts and engraved plaques, our laser work brings crisp detail to every project. Your designs are cut cleanly and engraved with fine, lasting precision. Whether it is a one-off gift or a production run for your business, we deliver work finished to a professional standard.",
    "sections": [
      {
        "heading": "What's in the range",
        "paragraphs": [
          "Acrylic cutting and engraving is ideal for modern signage, display letters, decorative panels and awards — cut to clean edges and engraved with sharp detail. It is also popular for menu holders, table numbers and office signage where a crisp, contemporary look matters. Laser wooden engraving adds a personal touch to gifts, plaques, home décor and corporate keepsakes, with text and designs burned permanently into the grain. Plywood cutting and engraving suits larger structural and decorative pieces, from display stands and models to intricate fretwork panels, exhibition pieces and retail displays. Laser wooden engraving also works beautifully on cutting boards, jewellery boxes and wall art. Laser tile engraving creates permanent, elegant markings on ceramic tile — perfect for commemorative plaques, house nameplates and decorative pieces that need to last."
        ]
      },
      {
        "heading": "Materials & customisation",
        "paragraphs": [
          "The laser works with acrylic sheet, natural wood, plywood and ceramic tile, each giving a different character to the finished piece — sleek and modern in acrylic, warm and natural in wood. Cutting follows your design exactly, from simple shapes to intricate patterns, and engraving reproduces text, logos and artwork with fine detail. You choose the material, the size and the design; we handle the rest, including clean edges and a tidy finish on every piece. If you are choosing between materials, think about where the finished item will live — acrylic suits contemporary interiors and signage, while wood and tile bring texture and permanence. Engraving can be a light surface mark or a deeper cut, depending on the effect you want, and the laser leaves clean, smooth edges so pieces are ready to use straight after cutting. Mixed-material designs — for example, an engraved wooden base with an acrylic top — are possible when your project calls for it."
        ]
      },
      {
        "heading": "How to choose & ordering",
        "paragraphs": [
          "Pick acrylic when you want a crisp, contemporary look — signage, awards and displays. Choose wood or plywood for warmth and craftsmanship in gifts, décor and larger builds. Tile is the choice for permanent engraved pieces like plaques and nameplates. Send us your design, logo or text, along with the material and size you have in mind — and the exact measurements if the piece must fit a particular space. For business orders, send your logo in a clear, high-contrast version so fine details engrave cleanly. If you are engraving a gift, double-check names and dates before approving the proof, since engraved text is permanent. We will prepare a proof showing the layout and engraving detail for your approval. Once you approve it, your pieces go into production and are delivered across Sri Lanka or made ready for collection."
        ]
      }
    ],
    "faqs": [
      {
        "q": "What can be engraved with a laser?",
        "a": "Text, logos, names, dates and decorative designs can all be engraved. We engrave on acrylic, wood, plywood and tile — each material takes the laser beautifully and the marking is permanent."
      },
      {
        "q": "Can you cut custom shapes?",
        "a": "Yes. The laser cuts acrylic, wood and plywood to your exact design, from simple outlines to detailed patterns. Send your artwork or dimensions and we will confirm what is possible."
      },
      {
        "q": "Is laser engraving permanent?",
        "a": "Yes. Unlike printing or stickers, laser engraving marks the material itself, so it will not peel, fade or wash off. That makes it ideal for plaques, nameplates and gifts meant to last."
      },
      {
        "q": "Do you deliver laser-cut items across Sri Lanka?",
        "a": "Yes. Finished pieces are packed carefully and delivered across Sri Lanka, or you can collect your order from us."
      }
    ]
  },
  "graphic-designing": {
    "intro": "Graphic Designing in Sri Lanka — professional logo design, brand identity and print-ready artwork prepared for flawless printing. Our graphic design service covers logo creation, business stationery, brochures, flyers and marketing collateral, all designed with print production in mind. Ideal for start-ups, established businesses and resellers who need polished artwork that translates perfectly from screen to print.",
    "sections": [
      {
        "heading": "What we design",
        "paragraphs": [
          "Our design service covers the full range of branding and marketing materials. Logo design includes primary logos, secondary marks and colour variations for consistent use everywhere. Brand identity packages bring together logos, business cards, letterheads, envelopes and brand guidelines. We also design flyers, brochures, posters, packaging, menus, certificates and social media graphics, plus print-ready artwork preparation — taking your existing files and checking bleeds, colour modes, resolution and fonts so nothing goes wrong at print time."
        ]
      },
      {
        "heading": "Your options and customisation",
        "paragraphs": [
          "Every project starts with a brief: tell us your business name, style preferences, colours you like, and any existing branding we should work with. You can supply reference images or leave the creative direction to our designers. Deliverables are supplied in the formats printers need — typically print-ready PDF with proper bleeds and crops, plus editable source files and web-ready versions on request. Revisions are part of the process, so the final design reflects your vision, not just our first idea."
        ]
      },
      {
        "heading": "How to choose and how ordering works",
        "paragraphs": [
          "Choose a design service based on portfolio quality and print knowledge, not just price — a beautiful design that isn't set up for print can cause costly delays. When you work with a print company that also designs, artwork is prepared for our own production standards, removing a common source of errors.",
          "Ordering is simple. Send us your brief or artwork files, and we confirm the scope and any questions. Our designers prepare concepts or artwork-checked files, and we share a proof for your review — check wording, spelling and layout carefully at this stage, as approval locks the design for production. Once approved, finished artwork moves straight into printing or is handed over to you for use elsewhere. Delivery and collection are available across Sri Lanka."
        ]
      }
    ],
    "faqs": [
      {
        "q": "Can you prepare my existing design for printing?",
        "a": "Yes. We check your files for common print problems — missing bleeds, low resolution, RGB instead of CMYK colour, and unembedded fonts — then fix them so the file prints exactly as intended. This service is ideal if you already have a design but your printer has rejected the artwork."
      },
      {
        "q": "What do I need to provide for a new logo design?",
        "a": "Just your business name and a short description of what you do, plus any style preferences or colours you favour. Reference examples help, but they are not required — our designers can develop concepts from a plain brief and refine them with your feedback through proofing rounds."
      },
      {
        "q": "Will I get the editable source files?",
        "a": "Yes. Alongside the print-ready PDF, we supply editable source files so your branding can be updated or reused in future, plus web-ready versions suitable for websites and social media. Everything you need to use your design everywhere is included in the deliverable."
      },
      {
        "q": "Why use a print company's design service instead of a standalone designer?",
        "a": "Because the designer understands production. Colours, bleeds, safe areas and material limitations are considered from the first draft, so there is no gap between what you approve and what gets printed — fewer revisions, no rejected files, and a smoother path from concept to finished product."
      }
    ]
  },
  "promotional-gift-items": {
    "intro": "Promotional & Gift Items in Sri Lanka — branded display and gift solutions that put your business in front of customers. Our range includes acrylic price tag holders, pull-up banner stands and QR code stands, designed for retail counters, events, exhibitions and corporate gifting. Perfect for shops, restaurants, offices and marketers who want professional, reusable promotional items.",
    "sections": [
      {
        "heading": "What's in the range",
        "paragraphs": [
          "The category focuses on practical promotional and gift items with everyday business use. Acrylic price tag holders keep pricing neat and visible on retail counters, shelves and display units. Pull-up banner stands are the workhorse of events and exhibitions — a large printed graphic in a portable cassette base that sets up in seconds. QR code stands combine physical display with digital action, letting customers scan straight through to your menu, website, payment page or social profile. Each item is produced to order with your branding."
        ]
      },
      {
        "heading": "Materials, sizes & customisation",
        "paragraphs": [
          "Acrylic price tag holders are made from clear acrylic that keeps printed inserts readable and protected while looking clean on any counter. Banner stands come with a printed graphic on durable banner material, retracting into a weighted aluminium base for stability and easy transport. QR code stands are produced with your custom artwork, so the code, logo and message are printed as one finished piece. Customisation covers printed graphics, brand colours, logos and messaging — artwork can be supplied by you or prepared through our graphic design service, and a proof is confirmed before production begins."
        ]
      },
      {
        "heading": "How to choose and how ordering works",
        "paragraphs": [
          "Choose based on where the item will be used. For permanent counter display, acrylic holders and QR code stands suit retail and hospitality counters. For events, trade shows and promotions, pull-up banners give maximum visibility for minimum effort. If your message or QR destination changes often, ask about designs that allow the printed insert to be swapped without replacing the whole unit.",
          "Ordering starts with your brief: tell us the item, quantity and artwork. We prepare or check your design files and send a proof for approval — verify logos, text and QR codes carefully, since approval locks the design. Production follows, and finished items are delivered or available for collection across Sri Lanka."
        ]
      }
    ],
    "faqs": [
      {
        "q": "Can you print my company logo on these items?",
        "a": "Yes. All items in this category are customised with your branding — logos, colours, text and graphics are printed as part of the finished product. You can supply print-ready artwork or have our designers prepare it; either way, you approve a proof before anything is produced."
      },
      {
        "q": "Are the QR code stands reusable if my link changes?",
        "a": "QR codes point to a fixed destination, so if your link changes the printed code will need updating too. We recommend pointing your QR code to a page you control, such as your website or a link page, so the destination can change without reprinting the stand itself."
      },
      {
        "q": "Do pull-up banner stands come with a carry case?",
        "a": "Pull-up banner stands are designed for portability — the graphic retracts into the base unit for transport and storage. If you attend events regularly, this makes them easy to carry, set up and pack away repeatedly without damaging the print."
      },
      {
        "q": "Can I order different designs within one order?",
        "a": "Yes. If you need, for example, several QR code stands with different links or banners for different branches, each can carry its own artwork. Tell us the variations in your brief and we will confirm each design with separate proofs before production."
      }
    ]
  },
  "paper-material-printing": {
    "intro": "Paper Material Printing in Sri Lanka — bespoke and small-batch printing on paper for cards, tags, inserts and stationery-type jobs. We handle custom paper-based projects where off-the-shelf printing won't do, from one-off personal jobs to short runs for businesses. Ideal for anyone who needs quality paper printing in quantities that suit them, not a printer's minimum.",
    "sections": [
      {
        "heading": "What this service covers",
        "paragraphs": [
          "Paper material printing is our general service for bespoke and small-batch paper jobs. Typical work includes business and personal cards, product and price tags, packaging inserts, swing tickets, letterheads, compliment slips, certificates, invitations, menus and other stationery-type items. Because the service is bespoke, unusual sizes, shapes and finishes can be accommodated — if it can be printed on paper or light card, we can usually produce it. This category exists precisely for jobs that don't fit neatly into a standard product listing."
        ]
      },
      {
        "heading": "Materials, sizes & customisation",
        "paragraphs": [
          "We print on a range of paper and card stocks suited to different uses — lighter papers for inserts and letterheads, heavier card for tags, certificates and anything that needs to feel substantial. Sizes follow your requirements, from small tags to full-page formats, and finishing options such as cutting to custom shapes are available depending on the job. Customisation is the point of this service: your artwork, your wording, your sizes. Files can be supplied print-ready or prepared through our graphic design service, and everything is proofed before printing so you see exactly what will be produced."
        ]
      },
      {
        "heading": "How to choose and how ordering works",
        "paragraphs": [
          "For paper printing, the two decisions that matter most are stock and quantity. Heavier card suits items people handle — tags, certificates, cards — while lighter paper suits inserts and stationery. Because we specialise in bespoke and small batches, you order the quantity you actually need rather than over-printing to meet a large minimum.",
          "To order, send us your brief: what the item is, the size, the quantity and your artwork or design requirements. We confirm the specification and any questions, prepare or check the artwork, and send a proof for your approval — check all text, spelling and layout, as approval locks the job for printing. After approval, production runs and your finished items are delivered or available for collection across Sri Lanka."
        ]
      }
    ],
    "faqs": [
      {
        "q": "What is the smallest quantity I can order?",
        "a": "We specialise in bespoke and small-batch work, so short runs are welcome. Tell us the quantity you need in your brief and we will confirm what is practical for your particular job — there is no expectation to order hundreds when you only need a few."
      },
      {
        "q": "Can you print an unusual size or shape?",
        "a": "Yes — that is exactly what this service is for. Non-standard sizes, custom shapes and die-cut style pieces can be produced. Share your requirements and, if possible, a sketch or reference, and we will confirm feasibility when we review your brief."
      },
      {
        "q": "I don't have print-ready artwork. Can you help?",
        "a": "Absolutely. Our graphic design service can create the design from scratch or take your draft and prepare it properly for print — correct sizes, bleeds, colour mode and resolution. The design work and printing stay under one roof, which keeps everything consistent."
      },
      {
        "q": "How do I know the colours will print correctly?",
        "a": "We prepare and check all artwork before production, and you approve a proof first. For colour-critical work, tell us in your brief and we will advise on the best approach for your job. What you approve on the proof is what goes to print."
      }
    ]
  },
  "stainless-steel-brass-engraving": {
    "intro": "Stainless Steel & Brass Engraving in Sri Lanka — precision-engraved nameplates, house number plates and industrial signage. We engrave on stainless steel and brass for homes, offices and factories, producing durable plates, number plates and machine specification tags. Suited to anyone who needs permanent, professional markings that last.",
    "sections": [
      {
        "heading": "What's in the range",
        "paragraphs": [
          "The range covers engraved plates for identification, wayfinding and compliance. Brass engraved name plates and stainless steel engraved name plates suit office doors, desks, reception areas and building entrances. Brass and stainless steel house number plates give homes a sharp, permanent finish. For industry, engraved machine specification tags carry equipment details, serial numbers and safety information that must remain legible for the life of the machine. Every plate is engraved to order with your exact text and layout."
        ]
      },
      {
        "heading": "Materials, sizes & customisation",
        "paragraphs": [
          "Two metals, two characters. Brass offers a classic, prestigious look that suits homes, heritage buildings and formal offices, developing a rich patina over time. Stainless steel gives a modern, corrosion-resistant finish ideal for outdoor use, kitchens, factories and coastal environments. Customisation covers the engraved text — names, numbers, specifications — plus layout, and plates can be made to the size your location requires. Artwork or a clear text brief is all we need; a proof showing the layout is confirmed before engraving begins, so spelling and formatting are exactly right."
        ]
      },
      {
        "heading": "How to choose and how ordering works",
        "paragraphs": [
          "Choose brass for traditional or decorative settings where appearance matters most, and stainless steel where the plate faces weather, chemicals or heavy industrial use — it resists rust and keeps its finish. For machine tags, stainless steel is usually the safer choice for legibility over time. Consider mounting too: tell us where the plate will be fixed and we can advise on the practical options.",
          "Ordering is straightforward. Send your brief with the plate type, size, and the exact text to be engraved. We prepare the layout and send a proof for approval — check every character carefully, because engraving is permanent and approval locks the design. Once approved, your plates are engraved and finished, then delivered or available for collection across Sri Lanka."
        ]
      }
    ],
    "faqs": [
      {
        "q": "Which is better for outdoor use, brass or stainless steel?",
        "a": "Stainless steel is the better choice outdoors. It resists rust and corrosion, so it keeps its appearance and legibility in rain, sun and coastal air. Brass also works outdoors but will develop a patina over time, which some people like for its traditional character."
      },
      {
        "q": "Can you engrave serial numbers and technical specifications on machine tags?",
        "a": "Yes. Engraved machine specification tags are made for exactly this — equipment names, model numbers, serial numbers, ratings and safety information. Engraving keeps the text legible far longer than printed labels in industrial environments, which is why it is used for compliance and asset identification."
      },
      {
        "q": "What information do I need to provide for a house number plate?",
        "a": "Just the house number and any additional text you want, such as the house name or street. Tell us the approximate size that suits your gate, wall or door, and whether you prefer brass or stainless steel. We will prepare a layout proof showing exactly how it will look before engraving."
      },
      {
        "q": "Is the engraving permanent? Will it fade?",
        "a": "Engraving cuts the design into the metal itself rather than printing on the surface, so it cannot peel, wash or rub off. On stainless steel the marking stays crisp indefinitely; on brass it remains legible for the life of the plate, with the metal naturally developing character over time."
      }
    ]
  },
  "cnc-cutting-engraving": {
    "intro": "Turn your artwork into custom signs, display components and decorative pieces with PrintWorks.lk. Our CNC cutting and engraving service brings together material cutting, wooden detailing and practical fabrication for business and interior projects. Explore the options below, then send your design, dimensions and quantity for a custom quotation.",
    "sections": [
      {
        "heading": "What is CNC cutting & engraving?",
        "paragraphs": [
          "CNC stands for computer numerical control. A CNC router follows a digital design and uses rotating cutting tools to shape suitable materials. Through cutting separates a shape from a board, while engraving removes material to create recessed lettering, logos or patterns. Relief carving creates depth and raised details within a design. The result depends on the material, sheet thickness, cutter and artwork. CNC routing can produce repeatable components, but very small details and internal corners need design review. Tell us how the finished piece will be used so we can assess the appropriate process."
        ]
      },
      {
        "heading": "What's in the range",
        "paragraphs": [
          "MDF CNC Cutting — custom shapes, lettering, panels and display components cut from MDF. Share your dimensions and intended finish so the design can allow for edge preparation, joints and assembly where required.",
          "Eco / PVC Foam Board CNC Cutting — lettering, signage components and decorative shapes from Eco / PVC foam board. Send the board specification, thickness and intended application so our team can assess the design, cutting details and required finish.",
          "Plywood CNC Cutting — plywood panels, display parts, templates and interlocking components from your design. Specify the plywood grade, thickness and visible face. Fit requirements and grain direction are checked before production.",
          "Cladding CNC Cutting — ACP/cladding (aluminium composite panels) cut into custom shapes for sign faces and decorative features. Confirm whether you need cutting only or additional V-grooving for folding. Grooving, folding and installation require separate confirmation.",
          "Wood CNC Engraving & Carving — recessed lettering, logos, patterns or relief carving in suitable wood. The timber, engraving depth and level of detail influence the appearance. Send a reference image and dimensions for a feasibility review.",
          "CNC Cut Letters & Logos — individual letters, numbers and brand logos for reception walls, shop displays and event features. Specify the material, letter depth, colour and mounting method so the quotation reflects the required finish.",
          "Custom Wooden Signs & Nameplates — personalised wooden signs for businesses, homes, rooms and desks with names, logos or engraved details. Discuss the surface finish, installation position and exposure conditions before choosing the wood and treatment.",
          "MDF & Plywood Product Display Racks — countertop or floor-standing display racks built around your products. Provide product dimensions, quantities and expected shelf loads. Confirm whether you need cut components, flat-packed parts or an assembled unit, with branding assessed separately.",
          "CNC Decorative Panels & Partitions — patterned screens, wall features and decorative partitions for interior projects. Discuss pattern scale, open areas, framing and panel joins. Mounting arrangements and the strength of narrow details are reviewed before cutting.",
          "Custom CNC Cutting from Your Design — submit your own drawing for custom CNC cutting of parts, templates and shapes. Include dimensions, material details, quantities and any fitting requirements. The artwork is reviewed before the production scope and price are confirmed."
        ]
      },
      {
        "heading": "Materials for CNC cutting & engraving",
        "paragraphs": [
          "MDF (medium-density fibreboard): custom cutting and suitable recessed details, subject to board grade and finishing needs. Plywood: cut panels and components; engraving quality depends on the face veneer and construction. Solid wood: lettering, patterns and carving, subject to timber condition and design. Eco / PVC foam board: selected grades and thicknesses for lettering, signage components and custom shapes. ACP/cladding (aluminium composite panels): cutting for signage and decorative applications; grooving is assessed separately. Not every material supports every operation. Confirm the exact grade, sheet thickness and required finish before purchasing or delivering material."
        ]
      },
      {
        "heading": "Working bed size & project dimensions",
        "paragraphs": [
          "CNC working bed: 8 x 4 feet (2438.4 x 1219.2 mm). Usable cutting area and material thickness are checked for each job. Include overall and component dimensions; larger designs may need joined sections."
        ]
      },
      {
        "heading": "Artwork & accepted file formats",
        "paragraphs": [
          "Accepted CNC production file formats are Adobe Illustrator (AI), CorelDRAW (CDR), DXF and EPS. Prepare vector artwork at actual size with units clearly stated. Convert fonts to outlines, close cutting paths and remove duplicate lines. Separate cutting and engraving instructions, and identify engraving depth, quantities and the visible face. A photograph, JPG, PNG or sketch can explain your idea, but it may require redrawing or modelling before machining. For relief carving, confirm the required 3D file or modelling brief with our team. Design preparation and file-conversion charges, where applicable, are identified in the quotation."
        ]
      },
      {
        "heading": "Lead time, quotations & ordering",
        "paragraphs": [
          "Lead time depends on the project and is stated in your quotation. Artwork readiness, material availability, machining complexity, order quantity and finishing affect the schedule. Share your required completion date when requesting a quote; urgent work is subject to capacity. Send your artwork or reference, finished dimensions, quantity, material details, finish and delivery location by WhatsApp or email. We review feasibility and confirm material supply, design preparation, cutting, engraving and any finishing or assembly in the quotation. Approve the final artwork, dimensions, scope and payment terms before production begins.",
          "Collection or delivery is arranged according to the confirmed order. Large panels and assembled racks may need a dedicated transport arrangement. Pricing reflects setup, machining time, material use and agreed finishing. Ask whether sanding, painting, UV printing, hardware or assembly is available and included for your project."
        ]
      },
      {
        "heading": "Why choose PrintWorks.lk?",
        "paragraphs": [
          "PrintWorks.lk connects custom fabrication with established printing and signage services. Where the design and materials are suitable, your CNC components can be coordinated with UV printing, acrylic elements and branded signage for a complete project. Our approach starts with the intended result: the dimensions, appearance, fitting requirements and finish your project needs. A clearly defined quotation helps you understand whether you are receiving raw cut parts, finished components or an assembled product. Our team in Biyagama handles enquiries for projects across Sri Lanka, with transport arrangements confirmed for the finished size. Ready to discuss your project? Send your artwork, material details, size and quantity to request a CNC quotation. WhatsApp (text only): 070 666 8885. Email: sales@printworks.lk."
        ]
      }
    ],
    "faqs": [
      {
        "q": "Can I provide my own board or timber?",
        "a": "Some materials are available through PrintWorks.lk, while others must be supplied by the customer. Check current material, grade, thickness and colour availability before ordering. For customer-supplied material, send the specification, dimensions and photographs before delivery. Suitability, condition and the quantity required are checked before acceptance. Agree on material allowances and whether usable offcuts should be returned."
      },
      {
        "q": "Will my parts arrive painted or assembled?",
        "a": "The quotation confirms the included scope: whether you receive raw cut parts, finished components or an assembled unit. Ask whether sanding, painting, UV printing, hardware or assembly is available and included for your project. Finishing scope is agreed in the quotation, not assumed."
      },
      {
        "q": "Can you work from a photograph or sketch?",
        "a": "A photograph, JPG, PNG or sketch can explain your idea, but it may require redrawing or modelling before machining. Design preparation and file-conversion charges, where applicable, are identified in the quotation."
      },
      {
        "q": "How does CNC routing differ from laser cutting?",
        "a": "CNC routing shapes material with rotating cutting tools and suits thicker boards, through cutting and relief carving. Laser cutting and engraving is a separate service with its own material and detail strengths. Tell us how the finished piece will be used and we will assess the appropriate process."
      }
    ]
  },
};

export function getCategoryContent(slug: string): CategoryContent | undefined {
  return CATEGORY_CONTENT[slug];
}
