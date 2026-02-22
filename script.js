/* ========================================
   ZIKRA – COMPLETE JAVASCRIPT v2.0
   ======================================== */

// ===== AUDIO SYSTEM =====
let audioContext = null;
let isMuted = false;

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') audioContext.resume();
}

// Each tasbih gets a unique chord/melody for identification
const TASBIH_TONES = {
  1:  [[523,0],[659,0.08],[784,0.16],[1047,0.28]],   // C E G C8  — ascending bright
  2:  [[392,0],[440,0.09],[523,0.18],[392,0.30]],    // G A C G   — gentle loop
  3:  [[440,0],[554,0.09],[659,0.18],[880,0.30]],    // A C# E A8 — majestic
  4:  [[523,0],[659,0.08],[523,0.18]],               // C E C     — simple glory
  5:  [[587,0],[698,0.09],[587,0.20]],               // D F D     — thankful
  6:  [[659,0],[784,0.09],[988,0.18],[784,0.28]],    // E G B G   — triumphant
  7:  [[349,0],[440,0.09],[523,0.18],[349,0.30]],    // F A C F   — humbling
  8:  [[523,0],[659,0.08],[784,0.16],[659,0.26]],    // C E G E   — praise
  9:  [[440,0],[523,0.09],[659,0.18]],               // A C E     — magnificence
  10: [[392,0],[494,0.09],[659,0.18],[494,0.28]],    // G B E B   — seeking
  11: [[494,0],[587,0.09],[740,0.18],[587,0.28]],    // B D F# D  — salawat
  12: [[440,0],[554,0.09],[659,0.18]],               // A C# E    — laylat qadr
  13: [[349,0],[523,0.09],[698,0.18],[523,0.28]],    // F C F C   — mercy
  def:[[523,0],[659,0.09]],
};

function playTasbihTone(tasbihId) {
  if (isMuted) return;
  try {
    initAudioContext();
    const notes = TASBIH_TONES[tasbihId] || TASBIH_TONES.def;
    const now = audioContext.currentTime;
    notes.forEach(([freq, delay]) => {
      const osc  = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.13, now + delay + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.22);
      osc.start(now + delay);
      osc.stop(now + delay + 0.25);
    });
  } catch(e) {}
}

function playCompletionSound() {
  if (isMuted) return;
  try {
    initAudioContext();
    const melody = [[523,0],[659,0.15],[784,0.30],[1047,0.45],[784,0.60],[1047,0.75]];
    const now = audioContext.currentTime;
    melody.forEach(([freq, delay]) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain); gain.connect(audioContext.destination);
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.22, now + delay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);
      osc.start(now + delay); osc.stop(now + delay + 0.6);
    });
  } catch(e) {}
}

// ===== DATA =====

const TASBIH_LIST = [
  { id:1,  arabic:'يَا حَيُّ يَا قَيُّومُ', translit:'Ya Hayyu Ya Qayyum', trans:'O Ever-Living, O Self-Sustaining', benefit:'This is from the Greatest Names of Allah (Al-Ism al-Azam). Whoever recites it with humility, Allah will relieve their hardship.', target:40 },
  { id:2,  arabic:'لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ', translit:'La ilaha illa anta subhanaka inni kuntu minal-zalimin', trans:'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.', benefit:'The Dua of Yunus (AS). No Muslim recites it with sincerity except that Allah answers his prayer. (Tirmidhi)', target:40 },
  { id:3,  arabic:'لَا إِلَهَ إِلَّا اللَّهُ', translit:'La ilaha illallah', trans:'There is no deity worthy of worship except Allah', benefit:'The best dhikr. The Prophet ﷺ said it is the best thing he and the prophets before him have said. (Tirmidhi)', target:100 },
  { id:4,  arabic:'سُبْحَانَ اللَّهِ', translit:'Subhanallah', trans:'Glory be to Allah', benefit:'A tree is planted in Paradise for every recitation. Two words light on the tongue but heavy on the scale. (Bukhari)', target:33 },
  { id:5,  arabic:'الحَمْدُ لِلَّهِ', translit:'Alhamdulillah', trans:'All praise is due to Allah', benefit:'Fills the scale of good deeds. The Prophet ﷺ loved it most after SubhanAllah. Gratitude multiplies blessings.', target:33 },
  { id:6,  arabic:'اللَّهُ أَكْبَرُ', translit:'Allahu Akbar', trans:'Allah is the Greatest', benefit:'One of the four beloved phrases to Allah. Saying it 34 times after each prayer is part of the Sunnah of the Prophet ﷺ.', target:34 },
  { id:7,  arabic:'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', translit:'La hawla wa la quwwata illa billah', trans:'There is no might nor power except with Allah', benefit:'A treasure from the treasures of Paradise. It is a cure for 99 ailments, the least of which is worry. (Bayhaqi)', target:100 },
  { id:8,  arabic:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', translit:'Subhanallahi wa bihamdihi', trans:'Glory be to Allah and praise be to Him', benefit:'Whoever says it 100 times a day, his sins will be wiped away even if they were like the foam of the sea. (Bukhari)', target:100 },
  { id:9,  arabic:'سُبْحَانَ اللَّهِ الْعَظِيمِ', translit:'Subhanallahil-Azim', trans:'Glory be to Allah the Magnificent', benefit:'Light on the tongue, heavy on the scales, beloved to the Most Merciful. (Bukhari & Muslim)', target:33 },
  { id:10, arabic:'أَسْتَغْفِرُ اللَّهَ', translit:'Astaghfirullah', trans:'I seek forgiveness from Allah', benefit:'The Prophet ﷺ sought forgiveness 70 times a day. Istighfar brings relief from worries and provisions from unexpected sources. (Abu Dawud)', target:100 },
  { id:11, arabic:'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', translit:'Allahumma salli wa sallim ala nabiyyina Muhammad', trans:'O Allah, send blessings and peace upon our Prophet Muhammad', benefit:'Whoever sends one Salah upon the Prophet ﷺ, Allah will send ten upon him. (Muslim)', target:100 },
  { id:12, arabic:'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', translit:"Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni", trans:'O Allah, You are All-Pardoning, You love to pardon, so pardon me.', benefit:'The Dua taught by the Prophet ﷺ specifically for Laylatul Qadr. Recite abundantly in the last 10 nights.', target:40 },
  { id:13, arabic:'يَا رَحْمَنُ يَا رَحِيمُ', translit:'Ya Rahmanu Ya Rahim', trans:'O Most Gracious, O Most Merciful', benefit:'Two of the greatest names of Allah. Calling upon Allah by His Beautiful Names is highly recommended in the Quran (7:180).', target:100 }
];

const HADITH_LIST = [
  { arabic:'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى.', english:'Actions are judged by intentions, and every person will get the reward according to what he has intended.', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Book 1, Hadith 1' },
  { arabic:'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ.', english:'A Muslim is one from whose tongue and hands other Muslims are safe.', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Book 2, Hadith 9' },
  { arabic:'الدِّينُ النَّصِيحَةُ.', english:'The religion (Islam) is sincere advice and well-wishing.', source:'Sahih Muslim', ref:'Sahih Muslim, Book 1, Hadith 98' },
  { arabic:'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ.', english:'The best among you are those who learn the Quran and teach it.', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Vol 6, Book 61, Hadith 546' },
  { arabic:'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ.', english:'Whoever believes in Allah and the Last Day should speak good or keep silent.', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Book 73, Hadith 47' },
  { arabic:'ازْهَدْ فِي الدُّنْيَا يُحِبَّكَ اللَّهُ، وَازْهَدْ فِيمَا عِنْدَ النَّاسِ يُحِبَّكَ النَّاسُ.', english:'Be detached from the world and Allah will love you, and be detached from what people possess and people will love you.', source:'Sunan Ibn Majah', ref:'Sunan Ibn Majah, Book 37, Hadith 4102 – Declared Sahih by Al-Albani' },
  { arabic:'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ.', english:'The most beloved deeds to Allah are those that are done consistently, even if they are few.', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Book 76, Hadith 468' },
  { arabic:'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ.', english:'Fear Allah wherever you are. Follow a bad deed with a good one to erase it, and treat people with good character.', source:'Sunan At-Tirmidhi', ref:'Sunan At-Tirmidhi, Hadith 1987 – Declared Hasan by Tirmidhi' },
  { arabic:'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ.', english:'A strong believer is better and more beloved to Allah than a weak believer, though there is good in both.', source:'Sahih Muslim', ref:'Sahih Muslim, Book 33, Hadith 6441' },
  { arabic:'مَا مَلَأَ آدَمِيٌّ وِعَاءً شَرًّا مِنْ بَطْنٍ.', english:'No human ever filled a vessel worse than the stomach. Sufficient for the son of Adam are a few morsels to keep his back straight.', source:'Sunan At-Tirmidhi', ref:'Sunan At-Tirmidhi, Hadith 2380 – Declared Sahih by Al-Albani' },
  { arabic:'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.', english:'None of you truly believes until he loves for his brother what he loves for himself.', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Book 2, Hadith 12' },
  { arabic:'الصِّيَامُ جُنَّةٌ.', english:'Fasting is a shield (against sin and the Hellfire).', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Book 30, Hadith 1904' },
  { arabic:'إِذَا جَاءَ رَمَضَانُ فُتِّحَتْ أَبْوَابُ الْجَنَّةِ، وَغُلِّقَتْ أَبْوَابُ جَهَنَّمَ، وَسُلْسِلَتِ الشَّيَاطِينُ.', english:'When Ramadan arrives, the gates of Paradise are opened, the gates of Hell are closed, and the devils are chained.', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Book 30, Hadith 1899' },
  { arabic:'مَنْ قَامَ لَيْلَةَ الْقَدْرِ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ.', english:'Whoever stands in prayer on the Night of Al-Qadr out of faith and seeking reward, his previous sins will be forgiven.', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Book 31, Hadith 2008' },
  { arabic:'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ.', english:'Whoever fasts during Ramadan out of sincere faith and hoping to attain reward, his previous sins will be forgiven.', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Book 30, Hadith 1901' },
  { arabic:'إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الأَمْرِ كُلِّهِ.', english:'Allah is gentle and loves gentleness in all matters.', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Book 73, Hadith 6024' },
  { arabic:'أَفْضَلُ الصَّدَقَةِ أَنْ تَصَدَّقَ وَأَنْتَ صَحِيحٌ شَحِيحٌ.', english:'The best charity is that you give while you are healthy and fearful of poverty, hoping to become rich.', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Book 23, Hadith 1419' },
  { arabic:'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ.', english:'Whoever follows a path in pursuit of knowledge, Allah will make easy for him a path to Paradise.', source:'Sahih Muslim', ref:'Sahih Muslim, Book 35, Hadith 6853' },
  { arabic:'إِنَّ فِي الْجَسَدِ مُضْغَةً، إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ، وَإِذَا فَسَدَتْ فَسَدَ الْجَسَدُ كُلُّهُ، أَلَا وَهِيَ الْقَلْبُ.', english:'In the body there is an organ; if it is sound, the whole body is sound, and if it is corrupt, the whole body is corrupt. Verily, it is the heart.', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Book 2, Hadith 52' },
  { arabic:'خِيَارُكُمْ أَحْسَنُكُمْ أَخْلَاقًا.', english:'The best of you are those who have the best manners and character.', source:'Sahih Bukhari', ref:'Sahih Al-Bukhari, Book 73, Hadith 56' },
  { arabic:'مَنْ كَظَمَ غَيْظًا وَهُوَ قَادِرٌ عَلَى أَنْ يُنْفِذَهُ، دَعَاهُ اللَّهُ يَوْمَ الْقِيَامَةِ عَلَى رُؤُوسِ الْخَلَائِقِ.', english:'Whoever suppresses his anger while being able to carry it out, Allah will call him on the Day of Resurrection before all of creation.', source:'Sunan At-Tirmidhi', ref:'Sunan At-Tirmidhi, Hadith 2021 – Hasan' },
  { arabic:'الدُّعَاءُ هُوَ الْعِبَادَةُ.', english:'Supplication is worship.', source:'Sunan At-Tirmidhi', ref:'Sunan At-Tirmidhi, Hadith 3372 – Sahih' },
  { arabic:'مَنْ قَرَأَ آيَةَ الْكُرْسِيِّ دُبُرَ كُلِّ صَلَاةٍ مَكْتُوبَةٍ، لَمْ يَمْنَعْهُ مِنْ دُخُولِ الْجَنَّةِ إِلَّا أَنْ يَمُوتَ.', english:'Whoever recites Ayat Al-Kursi after every obligatory prayer, nothing will prevent him from entering Paradise except death.', source:"An-Nasa'i / Al-Albani", ref:'Al-Silsilah Al-Sahihah by Al-Albani, No. 972' },
  { arabic:'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ.', english:'Seeking knowledge is an obligation upon every Muslim.', source:'Sunan Ibn Majah', ref:'Sunan Ibn Majah, Hadith 224 – Sahih by Al-Albani' },
  { arabic:'إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ.', english:'Allah does not look at your forms or your wealth, but He looks at your hearts and your deeds.', source:'Sahih Muslim', ref:'Sahih Muslim, Book 32, Hadith 6220' },
  { arabic:'أَوْلَى النَّاسِ بِي يَوْمَ الْقِيَامَةِ أَكْثَرُهُمْ عَلَيَّ صَلَاةً.', english:'The people most deserving of me on the Day of Resurrection will be those who send the most salawat upon me.', source:'Sunan At-Tirmidhi', ref:'Sunan At-Tirmidhi, Hadith 484 – Hasan' },
  { arabic:'الصَّلَوَاتُ الْخَمْسُ، وَالْجُمُعَةُ إِلَى الْجُمُعَةِ، كَفَّارَةٌ لِمَا بَيْنَهُنَّ.', english:'The five prayers and Friday to Friday are expiations for whatever sins come between them.', source:'Sahih Muslim', ref:'Sahih Muslim, Book 2, Hadith 551' },
  { arabic:'كُلُّ ابْنِ آدَمَ خَطَّاءٌ، وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ.', english:'Every son of Adam sins, and the best of sinners are those who repent.', source:'Sunan At-Tirmidhi', ref:'Sunan At-Tirmidhi, Hadith 2499 – Hasan' }
];

const NAMES_99 = [
  {num:1,  arabic:'اللَّهُ',                       translit:'Allah',                  meaning:'The Greatest Name'},
  {num:2,  arabic:'الرَّحْمَنُ',                   translit:'Ar-Rahman',              meaning:'The All-Compassionate'},
  {num:3,  arabic:'الرَّحِيمُ',                    translit:'Ar-Rahim',               meaning:'The All-Merciful'},
  {num:4,  arabic:'الْمَلِكُ',                     translit:'Al-Malik',               meaning:'The Absolute Ruler'},
  {num:5,  arabic:'الْقُدُّوسُ',                   translit:'Al-Quddus',              meaning:'The Pure One'},
  {num:6,  arabic:'السَّلَامُ',                    translit:'As-Salam',               meaning:'The Source of Peace'},
  {num:7,  arabic:'الْمُؤْمِنُ',                   translit:"Al-Mu'min",              meaning:'The Inspirer of Faith'},
  {num:8,  arabic:'الْمُهَيْمِنُ',                 translit:'Al-Muhaymin',            meaning:'The Guardian'},
  {num:9,  arabic:'الْعَزِيزُ',                    translit:'Al-Aziz',                meaning:'The Victorious'},
  {num:10, arabic:'الْجَبَّارُ',                   translit:'Al-Jabbar',              meaning:'The Compeller'},
  {num:11, arabic:'الْمُتَكَبِّرُ',                translit:'Al-Mutakabbir',          meaning:'The Greatest'},
  {num:12, arabic:'الْخَالِقُ',                    translit:'Al-Khaliq',              meaning:'The Creator'},
  {num:13, arabic:'الْبَارِئُ',                    translit:"Al-Bari'",               meaning:'The Maker of Order'},
  {num:14, arabic:'الْمُصَوِّرُ',                  translit:'Al-Musawwir',            meaning:'The Shaper of Beauty'},
  {num:15, arabic:'الْغَفَّارُ',                   translit:'Al-Ghaffar',             meaning:'The Forgiving'},
  {num:16, arabic:'الْقَهَّارُ',                   translit:'Al-Qahhar',              meaning:'The Subduer'},
  {num:17, arabic:'الْوَهَّابُ',                   translit:'Al-Wahhab',              meaning:'The Giver of All'},
  {num:18, arabic:'الرَّزَّاقُ',                   translit:'Ar-Razzaq',              meaning:'The Sustainer'},
  {num:19, arabic:'الْفَتَّاحُ',                   translit:'Al-Fattah',              meaning:'The Opener'},
  {num:20, arabic:'اَلْعَلِيمُ',                   translit:'Al-Alim',                meaning:'The Knower of All'},
  {num:21, arabic:'الْقَابِضُ',                    translit:'Al-Qabid',               meaning:'The Constrictor'},
  {num:22, arabic:'الْبَاسِطُ',                    translit:'Al-Basit',               meaning:'The Reliever'},
  {num:23, arabic:'الْخَافِضُ',                    translit:'Al-Khafid',              meaning:'The Abaser'},
  {num:24, arabic:'الرَّافِعُ',                    translit:"Ar-Rafi'",               meaning:'The Exalter'},
  {num:25, arabic:'الْمُعِزُّ',                    translit:"Al-Mu'izz",              meaning:'The Bestower of Honor'},
  {num:26, arabic:'الْمُذِلُّ',                    translit:'Al-Muzill',              meaning:'The Humiliator'},
  {num:27, arabic:'السَّمِيعُ',                    translit:"As-Sami'",               meaning:'The Hearer of All'},
  {num:28, arabic:'الْبَصِيرُ',                    translit:'Al-Basir',               meaning:'The Seer of All'},
  {num:29, arabic:'الْحَكَمُ',                     translit:'Al-Hakam',               meaning:'The Judge'},
  {num:30, arabic:'الْعَدْلُ',                     translit:"Al-'Adl",                meaning:'The Just'},
  {num:31, arabic:'اللَّطِيفُ',                    translit:'Al-Latif',               meaning:'The Subtle One'},
  {num:32, arabic:'الْخَبِيرُ',                    translit:'Al-Khabir',              meaning:'The All-Aware'},
  {num:33, arabic:'الْحَلِيمُ',                    translit:'Al-Halim',               meaning:'The Forbearing'},
  {num:34, arabic:'الْعَظِيمُ',                    translit:"Al-'Azim",               meaning:'The Magnificent'},
  {num:35, arabic:'الْغَفُورُ',                    translit:'Al-Ghafur',              meaning:'The Forgiver'},
  {num:36, arabic:'الشَّكُورُ',                    translit:'Ash-Shakur',             meaning:'The Rewarder of Gratitude'},
  {num:37, arabic:'الْعَلِيُّ',                    translit:"Al-'Ali",                meaning:'The Highest'},
  {num:38, arabic:'الْكَبِيرُ',                    translit:'Al-Kabir',               meaning:'The Greatest'},
  {num:39, arabic:'الْحَفِيظُ',                    translit:'Al-Hafiz',               meaning:'The Preserver'},
  {num:40, arabic:'الْمُقِيتُ',                    translit:'Al-Muqit',               meaning:'The Nourisher'},
  {num:41, arabic:'الْحَسِيبُ',                    translit:'Al-Hasib',               meaning:'The Accounter'},
  {num:42, arabic:'الْجَلِيلُ',                    translit:'Al-Jalil',               meaning:'The Sublime One'},
  {num:43, arabic:'الْكَرِيمُ',                    translit:'Al-Karim',               meaning:'The Generous One'},
  {num:44, arabic:'الرَّقِيبُ',                    translit:'Ar-Raqib',               meaning:'The Watchful One'},
  {num:45, arabic:'الْمُجِيبُ',                    translit:'Al-Mujib',               meaning:'The Responder'},
  {num:46, arabic:'الْوَاسِعُ',                    translit:"Al-Wasi'",               meaning:'The All-Comprehending'},
  {num:47, arabic:'الْحَكِيمُ',                    translit:'Al-Hakim',               meaning:'The Perfectly Wise'},
  {num:48, arabic:'الْوَدُودُ',                    translit:'Al-Wadud',               meaning:'The Loving One'},
  {num:49, arabic:'الْمَجِيدُ',                    translit:'Al-Majid',               meaning:'The Majestic One'},
  {num:50, arabic:'الْبَاعِثُ',                    translit:"Al-Ba'ith",              meaning:'The Resurrector'},
  {num:51, arabic:'الشَّهِيدُ',                    translit:'Ash-Shahid',             meaning:'The Witness'},
  {num:52, arabic:'الْحَقُّ',                      translit:'Al-Haqq',                meaning:'The Truth'},
  {num:53, arabic:'الْوَكِيلُ',                    translit:'Al-Wakil',               meaning:'The Trustee'},
  {num:54, arabic:'الْقَوِيُّ',                    translit:'Al-Qawi',                meaning:'The Possessor of All Strength'},
  {num:55, arabic:'الْمَتِينُ',                    translit:'Al-Matin',               meaning:'The Forceful One'},
  {num:56, arabic:'الْوَلِيُّ',                    translit:'Al-Wali',                meaning:'The Governor'},
  {num:57, arabic:'الْحَمِيدُ',                    translit:'Al-Hamid',               meaning:'The Praised One'},
  {num:58, arabic:'الْمُحْصِيُ',                   translit:'Al-Muhsi',               meaning:'The Appraiser'},
  {num:59, arabic:'الْمُبْدِئُ',                   translit:"Al-Mubdi'",              meaning:'The Originator'},
  {num:60, arabic:'الْمُعِيدُ',                    translit:"Al-Mu'id",               meaning:'The Restorer'},
  {num:61, arabic:'الْمُحْيِي',                    translit:'Al-Muhyi',               meaning:'The Giver of Life'},
  {num:62, arabic:'اَلْمُمِيتُ',                   translit:'Al-Mumit',               meaning:'The Taker of Life'},
  {num:63, arabic:'الْحَيُّ',                      translit:'Al-Hayy',                meaning:'The Ever Living One'},
  {num:64, arabic:'الْقَيُّومُ',                   translit:'Al-Qayyum',              meaning:'The Self-Existing One'},
  {num:65, arabic:'الْوَاجِدُ',                    translit:'Al-Wajid',               meaning:'The Finder'},
  {num:66, arabic:'الْمَاجِدُ',                    translit:'Al-Majid',               meaning:'The Glorious'},
  {num:67, arabic:'الواحِدُ',                      translit:'Al-Wahid',               meaning:'The Only One'},
  {num:68, arabic:'اَلأَحَدُ',                     translit:'Al-Ahad',                meaning:'The One'},
  {num:69, arabic:'الصَّمَدُ',                     translit:'As-Samad',               meaning:'The Satisfier of All Needs'},
  {num:70, arabic:'الْقَادِرُ',                    translit:'Al-Qadir',               meaning:'The All Powerful'},
  {num:71, arabic:'الْمُقْتَدِرُ',                 translit:'Al-Muqtadir',            meaning:'The Creator of All Power'},
  {num:72, arabic:'الْمُقَدِّمُ',                  translit:'Al-Muqaddim',            meaning:'The Expediter'},
  {num:73, arabic:'الْمُؤَخِّرُ',                  translit:"Al-Mu'akhkhir",          meaning:'The Delayer'},
  {num:74, arabic:'الأَوَّلُ',                     translit:'Al-Awwal',               meaning:'The First'},
  {num:75, arabic:'الآخِرُ',                       translit:'Al-Akhir',               meaning:'The Last'},
  {num:76, arabic:'الظَّاهِرُ',                    translit:'Az-Zahir',               meaning:'The Manifest One'},
  {num:77, arabic:'الْبَاطِنُ',                    translit:'Al-Batin',               meaning:'The Hidden One'},
  {num:78, arabic:'الْوَالِي',                     translit:'Al-Wali',                meaning:'The Protecting Friend'},
  {num:79, arabic:'الْمُتَعَالِي',                 translit:"Al-Muta'ali",            meaning:'The Supreme One'},
  {num:80, arabic:'الْبَرُّ',                      translit:'Al-Barr',                meaning:'The Doer of Good'},
  {num:81, arabic:'التَّوَّابُ',                   translit:'At-Tawwab',              meaning:'The Ever Returning'},
  {num:82, arabic:'الْمُنْتَقِمُ',                 translit:'Al-Muntaqim',            meaning:'The Avenger'},
  {num:83, arabic:'الْعَفُوُّ',                    translit:"Al-'Afuww",              meaning:'The Pardoner'},
  {num:84, arabic:'الرَّؤُوفُ',                    translit:"Ar-Ra'uf",               meaning:'The Clement'},
  {num:85, arabic:'مَالِكُ الْمُلْكِ',             translit:'Malik-ul-Mulk',          meaning:'The Owner of All Sovereignty'},
  {num:86, arabic:'ذُو الْجَلَالِ وَالإِكْرَامِ', translit:'Dhul-Jalali Wal-Ikram',  meaning:'The Lord of Majesty and Bounty'},
  {num:87, arabic:'الْمُقْسِطُ',                   translit:'Al-Muqsit',              meaning:'The Equitable One'},
  {num:88, arabic:'الْجَامِعُ',                    translit:"Al-Jami'",               meaning:'The Gatherer'},
  {num:89, arabic:'الْغَنِيُّ',                    translit:'Al-Ghani',               meaning:'The Rich One'},
  {num:90, arabic:'الْمُغْنِي',                    translit:'Al-Mughni',              meaning:'The Enricher'},
  {num:91, arabic:'اَلْمَانِعُ',                   translit:"Al-Mani'",               meaning:'The Preventer of Harm'},
  {num:92, arabic:'الضَّارُّ',                     translit:'Ad-Darr',                meaning:'The Creator of The Harmful'},
  {num:93, arabic:'النَّافِعُ',                    translit:"An-Nafi'",               meaning:'The Creator of Good'},
  {num:94, arabic:'النُّورُ',                      translit:'An-Nur',                 meaning:'The Light'},
  {num:95, arabic:'الْهَادِي',                     translit:'Al-Hadi',                meaning:'The Guide'},
  {num:96, arabic:'الْبَدِيعُ',                    translit:"Al-Badi'",               meaning:'The Originator'},
  {num:97, arabic:'اَلْبَاقِي',                    translit:'Al-Baqi',                meaning:'The Everlasting One'},
  {num:98, arabic:'الْوَارِثُ',                    translit:'Al-Warith',              meaning:'The Inheritor of All'},
  {num:99, arabic:'الرَّشِيدُ',                    translit:'Ar-Rashid',              meaning:'The Righteous Teacher'}
];

const MOTIVATIONAL_QUOTES = [
  '"Indeed, in the remembrance of Allah do hearts find rest." — Quran 13:28',
  '"And He found you lost and guided you." — Quran 93:7',
  '"So remember Me; I will remember you." — Quran 2:152',
  '"Verily, with hardship comes ease." — Quran 94:6',
  '"Allah does not burden a soul beyond that it can bear." — Quran 2:286',
  '"Call upon Me; I will respond to you." — Quran 40:60',
  '"And whoever relies upon Allah – then He is sufficient for him." — Quran 65:3',
  '"The best of people are those who are most beneficial to others." — Prophet Muhammad ﷺ'
];

const RAMADAN_DHIKR = [
  { arabic:'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',                         trans:'O Allah, pardon me – Laylatul Qadr Dua' },
  { arabic:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',                         trans:'Glory be to Allah and praise; Glory be to Allah the Magnificent' },
  { arabic:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ', trans:'None has the right to be worshipped but Allah, alone, without partner' },
  { arabic:'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',                                             trans:'I seek forgiveness from Allah and repent to Him' },
  { arabic:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ',               trans:'O Allah, I ask You for Paradise and seek refuge from the Fire' },
];

// ===== STATE =====
let state = {
  currentTasbih: { name:'Select a Dhikr', arabic:'—', translit:'', target:33, id:null },
  count: 0, target: 33, sessionTotal: 0,
  soundEnabled: true, hadithIndex: 0,
  taraweehData: {}, customTasbihs: [], quoteIndex: 0
};

function loadState() {
  try {
    const saved = localStorage.getItem('zikra_state');
    if (saved) { const p = JSON.parse(saved); state = {...state, ...p}; }
    state.count = 0; state.sessionTotal = 0;
    isMuted = !state.soundEnabled;
  } catch(e) {}
}

function saveState() {
  try {
    localStorage.setItem('zikra_state', JSON.stringify({
      currentTasbih:state.currentTasbih, target:state.target,
      soundEnabled:state.soundEnabled, hadithIndex:state.hadithIndex,
      taraweehData:state.taraweehData, customTasbihs:state.customTasbihs
    }));
  } catch(e) {}
}

// ===== HISTORY =====
function getHistory() { try { return JSON.parse(localStorage.getItem('zikra_history')||'{}'); } catch(e){return {};} }
function addToHistory(n) {
  const h=getHistory(); const today=new Date().toISOString().split('T')[0];
  h[today]=(h[today]||0)+n; if(h[today]<0)h[today]=0;
  try{localStorage.setItem('zikra_history',JSON.stringify(h));}catch(e){}
}
function getTodayTotal() { const h=getHistory(); return h[new Date().toISOString().split('T')[0]]||0; }
function getWeekTotal() {
  const h=getHistory(); let t=0;
  for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()-i);t+=h[d.toISOString().split('T')[0]]||0;}
  return t;
}
function getMonthTotal() {
  const h=getHistory(); const now=new Date();
  const pfx=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  return Object.entries(h).filter(([k])=>k.startsWith(pfx)).reduce((s,[,v])=>s+v,0);
}
function getAllTotal() { return Object.values(getHistory()).reduce((s,v)=>s+v,0); }
function getStreak() {
  const h=getHistory(); let s=0; let d=new Date();
  while(true){const k=d.toISOString().split('T')[0];if(h[k]&&h[k]>0){s++;d.setDate(d.getDate()-1);}else break;}
  return s;
}

// ===== NAVIGATION =====
function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('page-'+btn.dataset.page).classList.add('active');
      if(btn.dataset.page==='tracker') updateTracker();
      if(btn.dataset.page==='counter') updateCounterUI();
      if(btn.dataset.page==='ramadan') updateRamadanPage();
    });
  });
}

// ===== TASBIH GRID =====
// Store all tasbihs in a lookup map so onclick can use numeric IDs only (no inline strings)
const _tasbihMap = {};

function renderTasbihGrid() {
  const grid = document.getElementById('tasbihGrid');
  const all = [...TASBIH_LIST, ...state.customTasbihs];

  // Rebuild lookup map
  all.forEach(t => { _tasbihMap[t.id] = t; });

  grid.innerHTML = all.map(t => {
    const id = t.id || 0;
    const safeT = t.target || 33;
    return `
    <div class="tasbih-card" data-id="${id}" data-target="${safeT}">
      <div class="tc-number">#${t.id || '?'}</div>
      <div class="tc-arabic">${t.arabic}</div>
      <div class="tc-translit">${t.translit || ''}</div>
      <div class="tc-trans">${t.trans || t.meaning || ''}</div>
      <div class="tc-benefit">${t.benefit || ''}</div>
      <div class="tc-target">Recommended: ${safeT}×</div>
      <div class="tc-actions">
        <button class="tc-btn" data-id="${id}">Start →</button>
        <button class="tc-sound-btn" data-sound="${id}" title="Preview sound">🔔</button>
      </div>
    </div>`;
  }).join('');

  // Attach events via delegation — avoids ALL inline string escaping issues
  grid.addEventListener('click', handleTasbihClick);
}

function handleTasbihClick(e) {
  // Sound preview button
  const soundBtn = e.target.closest('.tc-sound-btn');
  if (soundBtn) {
    e.stopPropagation();
    const id = parseInt(soundBtn.dataset.sound) || 'def';
    if (isMuted) { showToast('🔇 Enable sound first'); return; }
    initAudioContext(); playTasbihTone(id); showToast('🔔 Preview playing');
    return;
  }

  // Start button OR card click
  const card = e.target.closest('.tasbih-card');
  if (!card) return;
  const id = parseInt(card.dataset.id);
  const t = _tasbihMap[id];
  if (!t) return;
  startTasbih(t.id, t.translit || t.name || '', t.arabic || '', t.translit || '', t.target || 33);
}

// ===== START TASBIH =====
function startTasbih(id, name, arabic, translit, target) {
  state.currentTasbih = {id, name, arabic, translit, target:target||33};
  state.count = 0; state.target = target||33;
  saveState(); updateCounterUI(); renderBeads();
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelector('[data-page="counter"]').classList.add('active');
  document.getElementById('page-counter').classList.add('active');
}

// ===== COUNTER =====
function updateCounterUI() {
  const t = state.currentTasbih;
  document.getElementById('counterArabic').textContent = t.arabic||'—';
  document.getElementById('counterName').textContent = t.name||t.translit||'Select a Dhikr from Tasbih page';
  document.getElementById('countDisplay').textContent = state.count;
  const pct = Math.min((state.count/state.target)*100, 100);
  document.getElementById('progressBar').style.width = pct+'%';
  document.getElementById('progressLabel').textContent = `${state.count} / ${state.target}`;
  document.getElementById('sessionTotal').textContent = state.sessionTotal;
  document.getElementById('todayTotal').textContent = getTodayTotal();
  document.getElementById('streakDays').textContent = getStreak();
}

function renderBeads() {
  const ring = document.getElementById('beadRing');
  const beadCount = Math.min(state.target, 33);
  ring.innerHTML = '';
  const filled = state.count % beadCount || (state.count>=beadCount ? beadCount : state.count);
  for(let i=0;i<beadCount;i++){
    const b=document.createElement('div');
    b.className='bead'+(i<filled?' filled':'');
    ring.appendChild(b);
  }
}

function increment() {
  state.count++; state.sessionTotal++;
  addToHistory(1); saveState(); updateCounterUI(); renderBeads();
  const d=document.getElementById('countDisplay');
  d.classList.add('pulse'); setTimeout(()=>d.classList.remove('pulse'),150);
  if(navigator.vibrate) navigator.vibrate(25);
  playTasbihTone(state.currentTasbih.id||'def');
  if(state.count===state.target) setTimeout(()=>{document.getElementById('completionOverlay').classList.add('active');playCompletionSound();},200);
}

function undo() {
  if(state.count>0){state.count--;state.sessionTotal=Math.max(0,state.sessionTotal-1);addToHistory(-1);saveState();updateCounterUI();renderBeads();}
}
function resetCounter() { state.count=0;saveState();updateCounterUI();renderBeads(); }
function setTarget(n) { state.target=n;state.currentTasbih.target=n;saveState();updateCounterUI();renderBeads(); }
function setCustomTarget() { const v=parseInt(document.getElementById('customTargetInput').value);if(v>0)setTarget(v); }

// ===== SOUND TOGGLE =====
function updateSoundUI() {
  const btn = document.getElementById('soundToggle');
  if(isMuted){
    btn.textContent='🔇'; btn.title='Sound OFF – tap to enable'; btn.style.opacity='0.55';
  } else {
    btn.textContent='🔊'; btn.title='Sound ON – tap to mute'; btn.style.opacity='1';
  }
}

// ===== HADITH =====
function renderHadith() {
  const h = HADITH_LIST[state.hadithIndex];
  document.getElementById('hadithArabic').textContent=h.arabic;
  document.getElementById('hadithEnglish').textContent=h.english;
  document.getElementById('hadithRef').textContent=h.ref;
  document.getElementById('hadithSource').textContent=h.source;
  document.getElementById('hadithCounter').textContent=`${state.hadithIndex+1} / ${HADITH_LIST.length}`;
  const card=document.getElementById('hadithCard');
  card.style.opacity='0';card.style.transform='translateY(10px)';
  setTimeout(()=>{card.style.transition='all 0.4s';card.style.opacity='1';card.style.transform='translateY(0)';},50);
}
function nextHadith(){state.hadithIndex=(state.hadithIndex+1)%HADITH_LIST.length;saveState();renderHadith();}
function prevHadith(){state.hadithIndex=(state.hadithIndex-1+HADITH_LIST.length)%HADITH_LIST.length;saveState();renderHadith();}
function copyHadith(){
  const h=HADITH_LIST[state.hadithIndex];
  navigator.clipboard.writeText(`${h.arabic}\n\n${h.english}\n\n— ${h.ref}`).then(()=>showToast('Hadith copied!')).catch(()=>showToast('Copy failed'));
}
function shareHadith(){
  const h=HADITH_LIST[state.hadithIndex];
  const text=`${h.english}\n\n— ${h.ref}\n\nShared from Zikra App 🌙`;
  if(navigator.share){navigator.share({title:'Authentic Hadith – Zikra',text});}
  else{navigator.clipboard.writeText(text).then(()=>showToast('Copied for sharing!'));}
}

// ===== TRACKER =====
function updateTracker() {
  document.getElementById('tToday').textContent=getTodayTotal().toLocaleString();
  document.getElementById('tStreak').textContent=getStreak();
  document.getElementById('tWeek').textContent=getWeekTotal().toLocaleString();
  document.getElementById('tMonth').textContent=getMonthTotal().toLocaleString();
  document.getElementById('tAll').textContent=getAllTotal().toLocaleString();
  renderWeekChart();renderCalendar();renderHistoryLog();
}
function renderWeekChart(){
  const h=getHistory();const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const values=[],labels=[];
  for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);values.push(h[d.toISOString().split('T')[0]]||0);labels.push(days[d.getDay()]);}
  const max=Math.max(...values,1);
  document.getElementById('weekChart').innerHTML=values.map((v,i)=>`<div class="bar-item"><div class="bar-val">${v>0?v:''}</div><div class="bar-fill" style="height:${Math.max((v/max)*100,4)}%"></div><div class="bar-label">${labels[i]}</div></div>`).join('');
}
function renderCalendar(){
  const h=getHistory();const now=new Date();
  const year=now.getFullYear(),month=now.getMonth();const today=now.toISOString().split('T')[0];
  const firstDay=new Date(year,month,1).getDay();const dim=new Date(year,month+1,0).getDate();
  const dn=['Su','Mo','Tu','We','Th','Fr','Sa'];
  let html=dn.map(d=>`<div class="cal-header">${d}</div>`).join('');
  for(let i=0;i<firstDay;i++) html+='<div class="cal-day"></div>';
  for(let d=1;d<=dim;d++){
    const ds=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    let cls='cal-day';if(h[ds]>0)cls+=' has-data';if(ds===today)cls+=' today';
    html+=`<div class="${cls}" title="${h[ds]||0} dhikr">${d}</div>`;
  }
  document.getElementById('calendarGrid').innerHTML=html;
}
function renderHistoryLog(){
  const h=getHistory();const sorted=Object.entries(h).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,30);
  if(!sorted.length){document.getElementById('historyLog').innerHTML='<p style="color:var(--text-muted);padding:1rem 0;font-size:.85rem">No history yet. Start your Dhikr journey!</p>';return;}
  document.getElementById('historyLog').innerHTML=sorted.map(([date,count])=>`<div class="history-entry"><span class="history-date">${formatDate(date)}</span><span class="history-count">${count.toLocaleString()} dhikr</span></div>`).join('');
}
function formatDate(ds){const d=new Date(ds+'T00:00:00');return d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});}
function clearHistory(){if(confirm('Clear all history? This cannot be undone.')){localStorage.removeItem('zikra_history');updateTracker();showToast('History cleared');}}
function exportProgress(){
  const h=getHistory();const lines=['Date,Dhikr Count'];
  Object.entries(h).sort().forEach(([d,c])=>lines.push(`${d},${c}`));
  const blob=new Blob([lines.join('\n')],{type:'text/csv'});const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='zikra-progress.csv';a.click();URL.revokeObjectURL(url);
}

// ===== RAMADAN =====
function updateRamadanPage(){updateRamadanCountdown();renderTaraweehGrid();renderRamadanDhikr();}
function updateRamadanCountdown(){
  const start=new Date('2026-02-18T00:00:00');const end=new Date('2026-03-19T23:59:59');
  function tick(){
    const now=new Date();let diff;
    if(now<start){diff=start-now;document.getElementById('ramadanStatusText').textContent='Ramadan begins in';}
    else if(now<=end){diff=end-now;document.getElementById('ramadanStatusText').textContent='🌙 Ramadan Mubarak! Ends in';}
    else{document.getElementById('ramadanStatusText').textContent='May Allah accept! Next Ramadan soon.';['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id=>document.getElementById(id).textContent='0');return;}
    document.getElementById('cd-days').textContent=String(Math.floor(diff/86400000)).padStart(2,'0');
    document.getElementById('cd-hours').textContent=String(Math.floor((diff%86400000)/3600000)).padStart(2,'0');
    document.getElementById('cd-mins').textContent=String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
    document.getElementById('cd-secs').textContent=String(Math.floor((diff%60000)/1000)).padStart(2,'0');
  }
  tick();if(!window._ramadanTimer)window._ramadanTimer=setInterval(tick,1000);
}
function renderTaraweehGrid(){
  const saved=state.taraweehData||{};const grid=document.getElementById('taraweehGrid');grid.innerHTML='';
  for(let i=1;i<=30;i++){
    const div=document.createElement('div');
    div.className='taraweeh-day'+(saved[i]?' done':'');div.textContent=i;div.title=`Night ${i}`;
    div.onclick=()=>{saved[i]=!saved[i];state.taraweehData=saved;saveState();renderTaraweehGrid();};
    grid.appendChild(div);
  }
}
function resetTaraweeh(){if(confirm('Reset Taraweeh tracker?')){state.taraweehData={};saveState();renderTaraweehGrid();}}
function renderRamadanDhikr(){
  const list = document.getElementById('ramadanDhikrList');
  list.innerHTML = RAMADAN_DHIKR.map((d, i) =>
    `<div class="ramadan-dhikr-item" data-dhikr="${i}">
      <div class="ramadan-dhikr-arabic">${d.arabic}</div>
      <div class="ramadan-dhikr-trans">${d.trans}</div>
    </div>`
  ).join('');

  list.addEventListener('click', e => {
    const item = e.target.closest('.ramadan-dhikr-item');
    if (!item) return;
    const d = RAMADAN_DHIKR[parseInt(item.dataset.dhikr)];
    if (d) startTasbih(null, d.trans, d.arabic, '', 40);
  });
}

// ===== 99 NAMES – RTL QURAN FORMAT =====
function renderNames(filter=''){
  const filtered=NAMES_99.filter(n=>!filter||n.arabic.includes(filter)||n.translit.toLowerCase().includes(filter.toLowerCase())||n.meaning.toLowerCase().includes(filter.toLowerCase()));
  // RTL grid: names flow right-to-left like Arabic text, ordered 1→99 but grid direction is RTL
  document.getElementById('namesGrid').innerHTML=filtered.map(n=>`
    <div class="name-card" onclick="previewSound('def')">
      <div class="name-num">${n.num}</div>
      <div class="name-arabic">${n.arabic}</div>
      <div class="name-transliteration">${n.translit}</div>
      <div class="name-meaning">${n.meaning}</div>
    </div>`).join('');
}
function filterNames(){renderNames(document.getElementById('namesSearch').value);}

// ===== USER NAME =====
function loadUserName(){
  const name=localStorage.getItem('zikra_name')||'';
  if(name){document.getElementById('greetingText').textContent=`Assalamu Alaikum, ${name} 🌙`;}
  else{document.getElementById('nameModal').classList.add('active');}
}
function saveName(){
  const name=document.getElementById('nameInput').value.trim();
  if(name){localStorage.setItem('zikra_name',name);document.getElementById('greetingText').textContent=`Assalamu Alaikum, ${name} 🌙`;document.getElementById('nameModal').classList.remove('active');}
}
document.getElementById('editNameBtn').addEventListener('click',()=>{
  document.getElementById('nameInput').value=localStorage.getItem('zikra_name')||'';
  document.getElementById('nameModal').classList.add('active');
});

// ===== THEME TOGGLES =====
function initThemeToggles(){
  document.getElementById('themeToggle').addEventListener('click',()=>{
    document.body.classList.toggle('light-mode');
    document.getElementById('themeToggle').textContent=document.body.classList.contains('light-mode')?'🌙':'☀️';
    localStorage.setItem('zikra_theme',document.body.classList.contains('light-mode')?'light':'dark');
  });
  document.getElementById('ramadanToggle').addEventListener('click',()=>{
    document.body.classList.toggle('ramadan-mode');
    localStorage.setItem('zikra_ramadan',document.body.classList.contains('ramadan-mode')?'1':'0');
  });
  document.getElementById('soundToggle').addEventListener('click',()=>{
    initAudioContext();
    isMuted=!isMuted; state.soundEnabled=!isMuted; saveState(); updateSoundUI();
    if(!isMuted){playTasbihTone(4);showToast('🔊 Sound enabled');}
    else{showToast('🔇 Sound muted');}
  });
  if(localStorage.getItem('zikra_theme')==='light') document.body.classList.add('light-mode');
  if(localStorage.getItem('zikra_ramadan')==='1') document.body.classList.add('ramadan-mode');
}

// ===== STARS =====
function initStars(){
  const canvas=document.getElementById('starCanvas');const ctx=canvas.getContext('2d');let stars=[];
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  function createStars(){stars=[];for(let i=0;i<120;i++)stars.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.5+0.3,alpha:Math.random(),speed:Math.random()*0.005+0.002,delta:Math.random()>.5?1:-1});}
  function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);stars.forEach(s=>{s.alpha+=s.speed*s.delta;if(s.alpha>=1||s.alpha<=0.1)s.delta*=-1;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,232,160,${s.alpha})`;ctx.fill();});requestAnimationFrame(draw);}
  window.addEventListener('resize',()=>{resize();createStars();});resize();createStars();draw();
}

// ===== QUOTES =====
function initQuoteSlider(){
  let idx=0;
  setInterval(()=>{
    idx=(idx+1)%MOTIVATIONAL_QUOTES.length;
    const el=document.getElementById('quoteSlide');el.style.opacity='0';
    setTimeout(()=>{el.querySelector('p').textContent=MOTIVATIONAL_QUOTES[idx];el.style.transition='opacity 0.5s';el.style.opacity='1';},400);
  },7000);
}

// ===== CUSTOM TASBIH =====
function addCustomTasbih(){
  const arabic=document.getElementById('customArabic').value.trim();
  const name=document.getElementById('customName').value.trim();
  const target=parseInt(document.getElementById('customTarget').value)||33;
  if(!name&&!arabic){showToast('Please enter a name or Arabic text');return;}
  const custom={id:Date.now(),arabic:arabic||name,translit:name,trans:'',benefit:'Your personal Dhikr',target};
  state.customTasbihs.push(custom);saveState();renderTasbihGrid();
  document.getElementById('customArabic').value='';document.getElementById('customName').value='';document.getElementById('customTarget').value='';
  showToast('Custom Tasbih added!');
  startTasbih(custom.id,name||arabic,arabic||name,name,target);
}

// ===== TOAST =====
function showToast(msg){
  const ex=document.querySelector('.zikra-toast');if(ex)ex.remove();
  const t=document.createElement('div');t.className='zikra-toast';t.textContent=msg;
  t.style.cssText='position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:rgba(212,175,55,0.95);color:#000;padding:.6rem 1.2rem;border-radius:25px;font-size:.9rem;font-weight:700;z-index:9999;white-space:nowrap;animation:fadeInOut 2.5s forwards;pointer-events:none;';
  if(!document.getElementById('toastStyle')){const s=document.createElement('style');s.id='toastStyle';s.textContent='@keyframes fadeInOut{0%{opacity:0;transform:translate(-50%,10px)}15%{opacity:1;transform:translate(-50%,0)}80%{opacity:1}100%{opacity:0}}';document.head.appendChild(s);}
  document.body.appendChild(t);setTimeout(()=>t.remove(),2600);
}

// ===== ENTER KEY =====
document.getElementById('nameInput').addEventListener('keydown',e=>{if(e.key==='Enter')saveName();});

// ===== PWA =====
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{}));

// ===== INIT =====
function init(){
  loadState();initNav();initThemeToggles();initStars();initQuoteSlider();
  renderTasbihGrid();renderHadith();renderNames();loadUserName();
  updateCounterUI();renderBeads();updateTracker();updateSoundUI();
  // Wire special card buttons
  const ayatBtn = document.getElementById('startAyatBtn');
  if (ayatBtn) ayatBtn.addEventListener('click', () => startTasbih(100, 'Ayat-ul-Kursi', 'آية الكرسي', 'Ayat-ul-Kursi', 1));
  const duroodBtn = document.getElementById('startDuroodBtn');
  if (duroodBtn) duroodBtn.addEventListener('click', () => startTasbih(11, 'Durood Ibrahim', 'درود إبراهيم', 'Durood Ibrahim', 10));

  // Unlock audio on any touch/click
  document.body.addEventListener('click',()=>initAudioContext(),{once:true});
}
document.addEventListener('DOMContentLoaded',init);
