import { readImage, setPipelinesBaseUrl } from '@itk-wasm/image-io';

import '@kitware/vtk.js/Rendering/Profiles/All';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkImageSliceActor from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper';

// setup pipeline url to retrieve itk related resources (js files, worker files, wasm files), we are using ralative path here because of the config in vite.config.ts
// this should work for other packages too, but if you are working with multiple @itk-wasm pakcages at the same time, you should use the version from itk-wasm package
setPipelinesBaseUrl('/itk');

// the official example use a file input for local files, but did not give example on how to load remote files
// here we use a simple http fetch to get a remote png here, but it could definitely be extended for other senarios
fetch('screenshot.png')
  .then(resp => resp.blob())
  // blob to file instance, don't use a complex file name since the wasm file will resolve the file name which might get you into trouble
  // and yes I used a complex file name and debugged for a while LOL
  .then(blob => readImage(new File([blob], 'screenshot.png')))
  .then(({ image, webWorker }) => {
    console.debug('image read:');
    console.debug(image);
    webWorker.terminate();

    // from now on we can use the image freely
    return vtkITKHelper.convertItkToVtkImage(image);
  })
  .then(imageData => {
    // typical image rendering process with vtk
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      background: [0, 0, 0]
    });
    const renderer = fullScreenRenderer.getRenderer();
    const renderWindow = fullScreenRenderer.getRenderWindow();

    const actor = vtkImageSliceActor.newInstance();
    const mapper = vtkImageMapper.newInstance();
    mapper.setInputData(imageData);
    actor.setMapper(mapper);
    renderer.addActor(actor);
    renderer.resetCamera();
    // upside down because the 0,0 point is at the bottom left corner in vtk
    renderer.getActiveCamera().setViewUp(0, -1, 0);
    renderer.getActiveCamera().setParallelProjection(true);
    renderWindow.render();
  });
