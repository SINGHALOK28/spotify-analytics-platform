import { motion } from 'framer-motion';
import { getBucketBg } from '../../utils/formatters';

export default function Badge({ text, variant }) {
  // Use variant if provided, otherwise fallback to text bucket for backward compatibility or auto-resolution
  const bucketKey = variant || text;
  const bgClass = getBucketBg(bucketKey);

  return (
    <motion.span 
      whileHover={{ scale: 1.05 }}
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgClass}`}
    >
      {text}
    </motion.span>
  );
}
