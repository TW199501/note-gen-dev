import Vditor from 'vditor'
import Sync from "./sync";
import History from "./history";
import TextNumber from "./text-number";
import PrimarySync from "./primary-sync";
import Copy from "./copy";
import Export from "./export";
import VectorCalc from "./vector-calc";
import useArticleStore from "@/stores/article";

export default function CustomFooter({editor}: {editor?: Vditor}) {
  const { activeFilePath } = useArticleStore()
  return activeFilePath && <div className="h-6 w-full px-2 border-t shadow-sm items-center flex justify-between overflow-hidden">
    <div className="flex items-center gap-1">
      <TextNumber />
      <Copy editor={editor} />
      <Export editor={editor} />
    </div>
    <div className="flex items-center gap-1">
      <VectorCalc />
      <PrimarySync />
      <History editor={editor} />
      <Sync editor={editor} />
    </div>
  </div>
}