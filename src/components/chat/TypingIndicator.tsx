interface TypingIndicatorProps {
  userNames: string[];
}

const TypingIndicator = ({ userNames }: TypingIndicatorProps) => {
  if (userNames.length === 0) return null;

  const getTypingText = () => {
    if (userNames.length === 1) {
      return `${userNames[0]} is typing`;
    } else if (userNames.length === 2) {
      return `${userNames[0]} and ${userNames[1]} are typing`;
    } else {
      return `${userNames[0]} and ${userNames.length - 1} others are typing`;
    }
  };

  return (
    <div className="px-4 py-2 text-sm text-muted-foreground">
      {getTypingText()}
      <span className="inline-flex ml-1">
        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
      </span>
    </div>
  );
};

export default TypingIndicator;