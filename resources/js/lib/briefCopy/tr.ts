import type { BriefCopy } from "@/lib/briefCopy/types";

export const tr: BriefCopy = {
  seo: {
    title: "Proje Brief Formu",
    description:
      "Web siteniz veya UI/UX projenizi birkaç kısa adımda anlatın: hedefler, hedef kitle, içerik, tasarım yönü, bütçe ve takvim.",
  },

  page: {
    backToPortfolio: "Portfolyoya dön",
    eyebrow: "// Proje brief'i",
    title: "Projenizi bana anlatın",
    intro:
      "Hedefleriniz, hedef kitleniz ve aklınızdaki görünüm hakkında birkaç kısa soru. Yıldızlı alanlar zorunludur. Diğerleri hazırlanmama yardımcı olur, bu yüzden henüz bilmediklerinizi boş bırakabilirsiniz.",
    badgeTime: "Yaklaşık 8 dakika",
    badgeSteps: "5 kısa adım",
    badgeSaved: "Yazarken kaydedilir",
    privacyNote:
      "Yanıtlarınız yalnızca bu brief'e dönüş yapmak için kullanılır. Taslak, siz gönderene kadar bu tarayıcıda saklanır ve gönderince silinir.",
    languageLabel: "Dil",
    honeypot: "Bu alanı boş bırakın",
  },

  nav: {
    back: "Geri",
    next: "İleri",
    send: "Brief'imi gönder",
    sending: "Gönderiliyor...",
    uploading: (percent) => `Dosyalar yükleniyor... %${percent}`,
    uploadProgress: "Yükleme durumu",
  },

  progress: {
    stepOf: (current, total) => `Adım ${current} / ${total}`,
    ariaLabel: (current, total) => `Brief ilerlemesi: adım ${current} / ${total}`,
    completed: "tamamlandı",
  },

  steps: {
    about: { title: "Sizin hakkınızda", description: "Siz kimsiniz, işiniz ne yapıyor." },
    project: { title: "Proje ve hedefler", description: "Neye ihtiyacınız var ve başarı sizin için neye benziyor." },
    scope: { title: "Kapsam ve içerik", description: "Sayfalar, özellikler, diller ve hâlihazırda elinizde olanlar." },
    design: { title: "Marka ve tasarım", description: "Hedeflediğiniz görünüm ve his." },
    budget: { title: "Bütçe ve iletişim", description: "Bütçe, takvim ve size nasıl ulaşacağım." },
  },

  common: {
    required: " (zorunlu)",
    selectedCount: (selected, max) => `${selected} / ${max} seçildi`,
  },

  fields: {
    name: { label: "Adınız", placeholder: "Ayşe Yılmaz" },
    email: { label: "E-posta", placeholder: "ayse@yilmaz-studio.com" },
    company: {
      label: "Şirket veya marka adı",
      hint: "Bireysel iseniz bunu boş bırakabilirsiniz.",
      placeholder: "Yılmaz İç Mimarlık",
    },
    website_url: {
      label: "Mevcut web siteniz",
      hint: "Henüz yoksa boş bırakın.",
      placeholder: "yilmaz-studio.com",
    },
    business_description: {
      label: "İşiniz ne yapıyor?",
      hint: "İki üç cümle yeterli: ne sunuyorsunuz, kime ve nerede.",
      placeholder: "İstanbul'daki küçük kafe ve butikler için konseptten kuruluma kadar iç mekân tasarlıyor ve döşüyoruz.",
    },
    project_type: {
      label: "Neye ihtiyacınız var?",
      hint: "Örnek: eskimiş hissettiren bir siteniz varsa “Yeniden tasarım”ı seçin.",
    },
    goals: {
      label: "Site neyi başarmalı?",
      hint: "En fazla 3 seçin. Örnek: bir kafe “Daha fazla başvuru” ve “Güven oluşturma”yı seçebilir.",
    },
    audience: {
      label: "İdeal müşterileriniz kimler?",
      hint: "Yaş, rol, neye önem verdikleri, neyle zorlandıkları.",
      placeholder:
        "İlk veya ikinci şubesini açan 30–50 yaş arası kafe sahipleri. Atmosfere önem veriyorlar ve bütçeleri kısıtlı.",
    },
    primary_action: {
      label: "Ziyaretçinin yapması gereken tek şey",
      hint: "Ana eylem çağrınız.",
      placeholder: "Ücretsiz 20 dakikalık bir danışma görüşmesi ayırtmak",
    },
    competitors: {
      label: "Rakipler veya benzer işletmeler",
      hint: "Mümkünse bağlantı ekleyin; neyi iyi ya da kötü yaptıklarını yazın.",
      placeholder: "rakip-studio.com premium görünüyor ama içinde gezinmek zor",
    },
    pages: {
      label: "Hangi sayfalara ihtiyacınız var?",
      hint: "Gerekli olduğunu düşündüğünüz her şeyi seçin. Sonradan değişebilir.",
    },
    features: {
      label: "Özellikler ve entegrasyonlar",
      hint: "Örnek: bir kuaför büyük olasılıkla “Online randevu” ve “Bülten”i seçer.",
    },
    extra_requirements: {
      label: "Başka yapması gereken bir şey var mı?",
      placeholder: "Randevuları Google Takvim'imizle eşitlesin ve SMS hatırlatması göndersin.",
    },
    languages: {
      label: "Site hangi dillerde olmalı?",
      hint: "Ziyaretçilerinizin ihtiyaç duyduğu her dili seçin.",
    },
    other_language: { label: "Diğer dil", placeholder: "örn. Fransızca" },
    content_readiness: {
      label: "İçeriğiniz ne kadar hazır?",
      hint: "Örnek: metinler yazıldı ve fotoğraflar çekildi, ya da henüz hiçbir şey yok.",
    },
    domain_status: {
      label: "Alan adı ve barındırma",
      hint: "Örnek: markaniz.com ve onu barındıracak bir yer.",
    },
    brand_assets: { label: "Hâlihazırda hangi marka varlıklarına sahipsiniz?" },
    attachments: {
      label: "Logonuzu veya marka dosyalarınızı yükleyin",
      hint: "İsteğe bağlı. Bir logo, marka rehberi veya ne demek istediğinizi gösteren ekran görüntüleri.",
    },
    styles: {
      label: "Hangi stil markanıza uyuyor?",
      hint: "En fazla 3 seçin. Renkler her havanın yalnızca kaba bir ipucudur.",
    },
    brand_words: { label: "Markanızı anlatan üç kelime", placeholder: "sakin, özenli, güvenilir" },
    colour_preferences: {
      label: "Renk tercihleri",
      hint: "Sevdiğiniz renkler ve kaçınmak istedikleriniz.",
      placeholder: "Koyu yeşil ve sıcak kum rengi, lütfen kırmızı olmasın",
    },
    colour_mode: { label: "Açık mı koyu mu arayüz?" },
    typography: { label: "Tipografi hissi" },
    liked_sites: {
      label: "Beğendiğiniz web siteleri",
      hint: "En fazla 3. Adresi yapıştırın ve neyi beğendiğinizi yazın.",
    },
    disliked_sites: {
      label: "Beğenmediğiniz siteler veya stiller",
      placeholder: "Çok sayıda açılır pencere ve stok fotoğraf içeren dağınık sayfalar",
    },
    budget: {
      label: "Aklınızda nasıl bir bütçe var?",
      hint: "Yaklaşık rakamlar yeterli. Yalnızca doğru kapsamı önermeme yardımcı olur.",
    },
    timeline: { label: "Ne zaman ihtiyacınız var?" },
    deadline_note: {
      label: "Sabit bir teslim tarihi veya takvimin bir nedeni var mı?",
      placeholder: "Açılışımız 15 Mart'ta",
    },
    support: { label: "Yayından sonra destek ister misiniz?" },
    preferred_contact: { label: "Size nasıl ulaşayım?" },
    phone: { label: "Telefon veya WhatsApp numarası", placeholder: "+90 532 123 45 67" },
    notes: {
      label: "Bilmemi istediğiniz başka bir şey var mı?",
      placeholder: "Tüm yapıma karar vermeden önce ilk bir konsept görmeyi çok isteriz.",
    },
    consent: { label: "Yanıtlarımın saklanmasını ve bu brief'e dönüş yapmak için kullanılmasını kabul ediyorum." },
  },

  options: {
    projectTypes: {
      new_site: { label: "Yeni web sitesi", hint: "Sıfırdan başlıyorum" },
      redesign: { label: "Yeniden tasarım", hint: "Mevcut sitem eskimiş hissettiriyor" },
      landing_page: { label: "Açılış sayfası", hint: "Bir kampanya için tek odaklı sayfa" },
      web_app: { label: "Web uygulaması / panel", hint: "Giriş, veri, dahili araçlar" },
      design_only: { label: "Yalnızca UI/UX tasarımı", hint: "Tasarım var, geliştirme yok" },
      unsure: { label: "Henüz emin değilim", hint: "Birlikte netleştirelim" },
    },
    goals: {
      leads: { label: "Daha fazla başvuru / talep" },
      sell_online: { label: "Online satış" },
      bookings: { label: "Randevu / rezervasyon" },
      credibility: { label: "Güven oluşturma" },
      explain: { label: "Bir ürün veya hizmeti anlatma" },
      recruit: { label: "Personel bulma" },
      replace_outdated: { label: "Eskimiş siteyi yenileme" },
      internal_tool: { label: "Dahili araç / otomasyon" },
    },
    pages: {
      home: { label: "Ana sayfa" },
      about: { label: "Hakkımızda" },
      services: { label: "Hizmetler" },
      portfolio: { label: "Portfolyo / vaka çalışmaları" },
      pricing: { label: "Fiyatlandırma" },
      blog: { label: "Blog / haberler" },
      shop: { label: "Mağaza" },
      booking: { label: "Randevu" },
      faq: { label: "SSS" },
      careers: { label: "Kariyer" },
      contact: { label: "İletişim" },
      legal: { label: "Yasal sayfalar (gizlilik, künye)" },
    },
    features: {
      forms: { label: "İletişim / başvuru formları" },
      booking: { label: "Online randevu" },
      payments: { label: "Ödeme / e-ticaret" },
      accounts: { label: "Müşteri hesapları" },
      cms: { label: "Blog / içerik yönetimi" },
      newsletter: { label: "Bülten" },
      search: { label: "Arama" },
      analytics_seo: { label: "Analitik ve SEO" },
      crm: { label: "CRM (HubSpot, Pipedrive...)" },
      chat_ai: { label: "Canlı sohbet / yapay zekâ asistanı" },
      maps: { label: "Harita / konumlar" },
    },
    languages: {
      en: { label: "İngilizce" },
      de: { label: "Almanca" },
      fa: { label: "Farsça" },
      tr: { label: "Türkçe" },
      other: { label: "Diğer" },
    },
    contentReadiness: {
      ready: { label: "Tüm metinler ve fotoğraflar hazır" },
      partial: { label: "Bir kısmı hazır, gerisi için yardıma ihtiyacım var" },
      need_help: { label: "Metin yazımına ve görsellere ihtiyacım var" },
      unsure: { label: "Emin değilim" },
    },
    domainStatus: {
      both: { label: "İkisi de var" },
      domain_only: { label: "Yalnızca alan adı" },
      neither: { label: "Henüz ikisi de yok" },
      unsure: { label: "Emin değilim" },
    },
    brandAssets: {
      logo: { label: "Logo" },
      palette: { label: "Renk paleti" },
      fonts: { label: "Yazı tipleri" },
      guidelines: { label: "Marka rehberi" },
      imagery: { label: "Fotoğraf / illüstrasyon" },
      none: { label: "Henüz hiçbiri yok, marka kimliğine ihtiyacım var" },
    },
    styles: {
      minimal: { label: "Minimal ve temiz", hint: "Boşluk, az öğe" },
      bold: { label: "Gösterişli ve renkli", hint: "Güçlü renk, iri tipografi" },
      premium: { label: "Premium / lüks", hint: "Koyu, rafine, altın vurgular" },
      friendly: { label: "Samimi ve eğlenceli", hint: "Yuvarlak, sıcak, illüstrasyonlu" },
      corporate: { label: "Kurumsal ve güvenilir", hint: "Düzenli, sakin maviler" },
      tech: { label: "Teknoloji / fütüristik", hint: "Koyu arayüz, parıltı, gradyanlar" },
      editorial: { label: "Editoryal / dergi", hint: "Serif başlıklar, ızgara" },
      warm: { label: "Sıcak ve organik", hint: "Toprak tonları, yumuşak şekiller" },
    },
    colourModes: {
      light: { label: "Açık" },
      dark: { label: "Koyu" },
      either: { label: "Fark etmez" },
    },
    typography: {
      sans: { label: "Modern sans-serif", hint: "Temiz ve nötr" },
      serif: { label: "Klasik serif", hint: "Zarif ve editoryal" },
      mix: { label: "İkisinin karışımı", hint: "Serif başlık, sans metin" },
      none: { label: "Tercihim yok" },
    },
    budgets: {
      under_3k: { label: "3 bin dolar altı" },
      "3k_6k": { label: "3 - 6 bin dolar" },
      "6k_10k": { label: "6 - 10 bin dolar" },
      "10k_20k": { label: "10 - 20 bin dolar" },
      "20k_50k": { label: "20 - 50 bin dolar" },
      "50k_plus": { label: "50 bin dolar ve üzeri" },
      unsure: { label: "Henüz emin değilim" },
    },
    timelines: {
      asap: { label: "En kısa sürede", hint: "1 aydan az" },
      "1_2_months": { label: "1 - 2 ay" },
      "3_6_months": { label: "3 - 6 ay" },
      flexible: { label: "Esnek" },
    },
    support: {
      yes: { label: "Evet, sürekli bakım" },
      maybe: { label: "Belki" },
      no: { label: "Hayır" },
    },
    contactMethods: {
      email: { label: "E-posta" },
      phone: { label: "Telefon / WhatsApp" },
      video: { label: "Görüntülü görüşme" },
    },
  },

  files: {
    dropTitle: "Dosyaları buraya bırakın ya da göz atmak için tıklayın",
    dropHelp: (types, megabytes, max) =>
      `Logo, marka rehberi veya ilham verici örnekler. ${types}; her biri en fazla ${megabytes} MB, en çok ${max} dosya.`,
    selected: "Seçilen dosyalar",
    remove: (name) => `${name} dosyasını kaldır`,
    wrongType: (name, types) => `${name}: yalnızca ${types} dosyaları kabul edilir.`,
    tooLarge: (name, megabytes) => `${name}: dosyalar en fazla ${megabytes} MB olabilir.`,
    tooMany: (name, max) => `${name}: en fazla ${max} dosya yükleyebilirsiniz.`,
  },

  likedSites: {
    urlPlaceholder: "https://linear.app",
    notePlaceholder: "Temiz yerleşim, akıcı animasyonlar",
    addressLabel: (position) => `${position}. sitenin adresi`,
    noteLabel: (position) => `${position}. sitede beğendikleriniz`,
    remove: (position) => `${position}. siteyi kaldır`,
    add: "Bir site daha ekle",
  },

  errors: {
    nameRequired: "Lütfen adınızı yazın.",
    emailRequired: "Lütfen e-posta adresinizi ekleyin.",
    emailInvalid: "Bu e-posta adresi doğru görünmüyor.",
    descriptionShort: "İşiniz hakkında bir iki cümle çok yardımcı olur (en az 10 karakter).",
    projectType: "Size en uygun seçeneği işaretleyin.",
    goals: "En az bir hedef seçin.",
    audienceShort: "İdeal müşterilerinizi bir iki cümleyle anlatın (en az 10 karakter).",
    styles: "En az bir stil seçin.",
    budget: 'Bir bütçe aralığı seçin ya da "Henüz emin değilim" seçeneğini işaretleyin.',
    timeline: "Bir takvim seçin.",
    contact: "Size nasıl ulaşmamı istediğinizi seçin.",
    phoneRequired: "Size ulaşabilmem için bir telefon numarası ekleyin.",
    phoneInvalid: "Yalnızca rakam, boşluk ve + ( ) - karakterlerini kullanın.",
    consent: "Lütfen yanıtlarınızı size dönüş yapmak için saklayabileceğimi onaylayın.",
  },

  thanks: {
    title: (name) => (name ? `Teşekkürler, ${name}.` : "Teşekkürler."),
    bodyBefore: "Brief'iniz bana ulaştı. Dikkatle okuyacağım ve sorularla ya da yönle ilgili ilk bir fikirle 24 saat içinde ",
    bodyAfter: " adresine yanıt vereceğim.",
    backToPortfolio: "Portfolyoya dön",
    sendAnother: "Başka bir brief gönder",
  },
};
