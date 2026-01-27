import { StrapiPicture } from '@shared/types/cms/CMSTypes';
import HeroSingleImageStyles from '../HeroSingleImage/HeroSingleImage.module.css';
import { TryGetImageFormatUrl } from '@/app/_utils/types/cms/cmsTypeTools';
import { isStrapiPicture } from '@shared/types/cms/CMSCheck';

interface Props {
  images: StrapiPicture[];
}

type FloatingImagesInfo = {
  x: string | number;
  y: string | number;
  width: number;
  zIndex: number;
};

const floatingImages: FloatingImagesInfo[] = [
  {
    x: "50%",
    y: "50%",
    width: 20,
    zIndex: 10,
  },
  {
    x: "15%",
    y: "8%",
    width: 2,
    zIndex: 9,
  },
  {
    x: "90%",
    y: "10%",
    width: 4,
    zIndex: 8,
  },
  {
    x: "20%",
    y: "80%",
    width: 3,
    zIndex: 7,
  },
  {
    x: "80%",
    y: "70%",
    width: 5,
    zIndex: 6,
  },
  {
    x: "10%",
    y: "60%",
    width: 2.5,
    zIndex: 5,
  },
  {
    x: "70%",
    y: "20%",
    width: 3.5,
    zIndex: 4,
  },
  {
    x: "30%",
    y: "30%",
    width: 4.5,
    zIndex: 3,
  },
  {
    x: "60%",
    y: "85%",
    width: 3,
    zIndex: 2,
  },
  {
    x: "40%",
    y: "10%",
    width: 2,
    zIndex: 1,
  },
];

const floatWeight = 0.1;
const floatTime = 3;
export default function HeroFloatingImages({ images }: Props) {
  const availableFloatingImages = floatingImages.slice(0, images.length);
  const maxWidth = Math.max(...availableFloatingImages.map((img) => img.width));
  return (
    <div className={HeroSingleImageStyles.container} style={{position: 'relative'}}>
      <div className={HeroSingleImageStyles.imageWrapper}>
        {availableFloatingImages.map((img, index) => {
          return (
            <img
              key={index}
              src={isStrapiPicture(images[index]) ? TryGetImageFormatUrl(images[index], index == 0 ? 'medium' : 'small') : undefined}
              alt={`floatingImg${index}`}
              style={{
                userSelect: "none",
                pointerEvents: "none",
                position: "absolute",
                left: img.x,
                top: img.y,
                width: img.width + "rem",
                opacity: Math.sqrt(img.width / maxWidth),
                zIndex: img.zIndex,
                transform: `translate(-50%, -50%)`,
                animation: `floatUpDown${index} ${
                  Math.random() * floatTime + floatTime
                }s ease-in-out infinite alternate`,
                borderRadius: '0.5rem'
              }}
            />
          );
        })}
        <style>
          {availableFloatingImages
            .map((img, index) => {
              const floatDistance = `${img.width * floatWeight}rem`;
              return `
          @keyframes floatUpDown${index} {
          0% { transform: translate(-50%, -50%) translateY(0); }
          100% { transform: translate(-50%, -50%) translateY(-${floatDistance}); }
          }
        `;
            })
            .join("\n")}
        </style>
      </div>
    </div>
  );
}
