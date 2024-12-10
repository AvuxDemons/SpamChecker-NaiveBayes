const NaiveBayes = require('./bayes');

// Dataset contoh
const trainingData = [
    { text: 'Selamat, Anda mendapatkan hadiah Motor. Silahkan kirim nomer rekening anda.', category: 'spam' },
    { text: 'Silahkan isi nomor rekening di bawah ini.', category: 'spam' },
    { text: 'Anda mendapatkan hadiah mobil. Silahkan isi alamat anda.', category: 'spam' },
    { text: 'Nanti, jam 10 pagi saya ke rumah anda.', category: 'not_spam' },
    { text: 'Ingin cepat kaya cuma di rumah saja ? join di kangparkir.com .', category: 'spam' },
    { text: 'Selamat siang pak , apakah nanti bisa ketemuan jam 8 pagi ya ?.', category: 'not_spam' },
    { text: 'Dijamin menang & WD , pasti cair tanpa proses lama.', category: 'spam' },
    { text: 'Selamat nomor anda terpilih sebagai nomor penerima hadiah kapal selam.', category: 'spam' },
];

const testData = [
    'Halo bro , gimana kabar mu ?',
    'Selamat sore kak , ada yang bisa kami bantu ?',
    'Apakah ada kabar terbaru terkait kasus vina garut ?',
    'Ingin menang terus ? WD pasti cair ? Segera gabung IKANCURUT.com',
    'Selamat, Nomor anda telah memenangkan undian hadiah pesawat',
];

// const trainingData = [
//     { text: 'Manis Terang', category: 'A' }, // Jeruk
//     { text: 'Asam Terang', category: 'C' }, // Lemon
//     { text: 'Manis Terang', category: 'C' }, // Apel
//     { text: 'Manis Terang', category: 'B' }, // Pisang
//     { text: 'Manis Terang', category: 'B' }, // Anggur
//     { text: 'Pahit Terang', category: 'E' }, // Alpukat
//     { text: 'Asam Terang', category: 'C' }, // Kiwi
//     { text: 'Manis Terang', category: 'A' }, // Mangga
//     { text: 'Manis Terang', category: 'A' }, // Melon
//     { text: 'Pahit Gelap', category: 'A' }, // Jambu
//     { text: 'Manis Terang', category: 'A' }, // Nanas
//     { text: 'Manis Terang', category: 'C' }, // Pir
//     { text: 'Manis Terang', category: 'C' }, // Stroberi
//     { text: 'Asam Terang', category: 'C' }, // Ceri
//     { text: 'Asam Gelap', category: 'C' }, // Delima
//     { text: 'Manis Gelap', category: 'A' }, // Persik
//     { text: 'Manis Terang', category: 'C' }, // Plum
//     { text: 'Manis Terang', category: 'C' }, // Kiwi
//     { text: 'Manis Terang', category: 'A' }, // Anggur
//     { text: 'Manis Terang', category: 'C' }, // Apel
//     { text: 'Manis Gelap', category: 'C' }, // Manggis
// ];

// const testData = [
//     'Manis Gelap', // Semangka
//     'Manis Terang', // Duku
//     'Manis Gelap', // Sawo
//     'Terang Asam', // Sirsak
// ];

async function main() {
    const classifier = new NaiveBayes();

    // Training classifier
    for (const data of trainingData) {
        await classifier.learn(data.text, data.category);
    }

    // Data Model
    const jsonModel = classifier.toJson();
    const deserializedClassifier = NaiveBayes.fromJson(jsonModel);
    // console.log('Data Model :', jsonModel);
    console.log('Classifier Model :', deserializedClassifier);


    // Klasifikasikan komentar baru
    for (const comment of testData) {
        const category = await classifier.categorize(comment);
        console.log(`Komentar: "${comment}" dikategorikan sebagai: ${category}`);
    }
}

main();
