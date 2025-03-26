# Personal Website - 3D Model Customizer

A personal website featuring a 3D model customizer for a vintage suit, inspired by the customization experience on Alpinestars.

## Features

- Interactive 3D model viewer and customizer
- Real-time color and material changes
- Part-specific customization
- Multiple camera viewpoints
- Responsive design

## Setup and Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Prepare the 3D model:
   - Download the vintage suit model from [BlendSwap](https://blendswap.com/blend/21525)
   - You'll need to create a free account to download the model
   - Export the model as GLB format from Blender
   - Place the exported model file in the `src/assets/models/` directory as `homme_1900b.glb`

4. Start the development server:
```bash
npm run dev
```

## Model Attribution

The "Man 1900" (homme_1900b) model used in this project is created by [totopremier on BlendSwap](https://blendswap.com/profile/130499) and is licensed under [Creative Commons Attribution (CC-BY) license](https://creativecommons.org/licenses/by/3.0/).

## Technologies Used

- Vue.js 3
- Three.js for 3D rendering
- Tailwind CSS for styling
- Vite for building and development

## License

MIT 