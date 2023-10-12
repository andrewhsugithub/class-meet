import { Button } from "./ui/button";

interface ShareScreenProps {
  handleShare: () => void;
}

const ShareScreen = ({ handleShare }: ShareScreenProps) => {
  return <Button onClick={handleShare}>ShareScreen</Button>;
};

export default ShareScreen;
