import { useRouter } from "next/router"
import { AnimatePresence, motion } from "framer-motion"

const variants = {
  in: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      delay: 0.25,
    },
  },
  out: {
    opacity: 0,
    scale: 1,
    transition: {
      duration: 0.35,
    },
  },
}

const Transition = ({ children }) => {
  const { asPath } = useRouter()

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div key={asPath} variants={variants} animate="in" initial="out" exit="out">
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default Transition
