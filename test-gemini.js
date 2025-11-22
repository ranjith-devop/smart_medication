const axios = require('axios');

const API_KEY = 'AIzaSyBtVHLOc8fSm5bbqP4n4ez86oJ2mCpu8Us';

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    console.log(`Listing models from: ${url}`);

    try {
        const response = await axios.get(url);
        console.log('AVAILABLE GENERATIVE MODELS:');
        const genModels = response.data.models.filter(m => m.supportedGenerationMethods.includes('generateContent'));
        genModels.forEach(model => {
            console.log(`- ${model.name}`);
        });
    } catch (error) {
        console.log('FAILED TO LIST MODELS');
        console.log(error.message);
    }
}

listModels();
