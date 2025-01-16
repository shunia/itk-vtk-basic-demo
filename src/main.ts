import { readImage, setPipelinesBaseUrl } from '@itk-wasm/image-io';

setPipelinesBaseUrl(
  new URL('../node_modules/@itk-wasm/image-io/dist/pipelines', import.meta.url)
);
