import { Composition } from "remotion";
import { WebBuild } from "./WebBuild";
import { PcFix } from "./PcFix";
import { WinSetup } from "./WinSetup";
import { ReelEdit } from "./ReelEdit";
import { RemoteHelp } from "./RemoteHelp";

// Videos de motion graphics para las tarjetas de servicios de la página (1920×1080, 30 cuadros por segundo, en bucle)
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="WebBuild" component={WebBuild} durationInFrames={210} fps={30} width={1920} height={1080} />
      <Composition id="PcFix" component={PcFix} durationInFrames={210} fps={30} width={1920} height={1080} />
      <Composition id="WinSetup" component={WinSetup} durationInFrames={210} fps={30} width={1920} height={1080} />
      <Composition id="ReelEdit" component={ReelEdit} durationInFrames={210} fps={30} width={1920} height={1080} />
      <Composition id="RemoteHelp" component={RemoteHelp} durationInFrames={210} fps={30} width={1920} height={1080} />
    </>
  );
};
