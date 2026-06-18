import { motion } from 'framer-motion';

export default function PageWrapper({ children }) {
  return (
    <main className="px-6 py-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </main>
  );
}
