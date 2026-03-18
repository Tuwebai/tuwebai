interface AnimatedShapeProps {
  className?: string
  type: 1 | 2
  delay?: number
}

export default function AnimatedShape({
  className,
  type,
  delay = 0,
}: AnimatedShapeProps) {
  const style = {
    animationDelay: `${delay}s`,
  }

  const isShape1 = type === 1

  return (
    <div
      className={`absolute opacity-20 z-0 ${className}`}
      style={style}
    >
      <div
        className={`
          ${
            isShape1
              ? "w-[300px] h-[300px] bg-gradient-to-br from-[#00CCFF] to-[#9933FF]"
              : "w-[250px] h-[250px] bg-gradient-to-br from-[#9933FF] to-[#00CCFF]"
          }
          animate-float animate-morph
          rounded-[32%_58%_69%_43%/48%_32%_59%_55%]
        `}
      />
    </div>
  )
}
