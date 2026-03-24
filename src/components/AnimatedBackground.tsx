export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full opacity-10 animate-blob-1 will-change-transform"
        style={{
          background: "radial-gradient(circle, #FF0064 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 rounded-full opacity-15 animate-blob-2 will-change-transform"
        style={{
          background: "radial-gradient(circle, #1A1A2E 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-1/2 h-1/2 rounded-full opacity-8 animate-blob-3 will-change-transform"
        style={{
          background: "radial-gradient(circle, #FF0064 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}
