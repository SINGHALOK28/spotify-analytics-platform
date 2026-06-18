export const formatDuration = (minutes) => {
  if (!minutes) return "0:00";
  const mins = Math.floor(minutes);
  const secs = Math.round((minutes % 1) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getBucketColor = (bucket) => {
  switch (bucket?.toLowerCase()) {
    case 'low': return 'text-gray-500';
    case 'medium': return 'text-blue-500';
    case 'popular': return 'text-green-500';
    case 'hit': return 'text-yellow-500';
    default: return 'text-gray-400';
  }
};

export const getBucketBg = (bucket) => {
  switch (bucket?.toLowerCase()) {
    case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'popular': return 'bg-green-100 text-green-700 border-green-200';
    case 'hit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: return 'bg-gray-100 text-gray-500 border-gray-200';
  }
};

export const formatSimilarity = (score) => {
  if (score == null) return "0%";
  return `${Math.round(score * 100)}%`;
};

export const formatPopularity = (score) => {
  if (score == null) return "0/100";
  return `${Math.round(score)}/100`;
};

export const truncate = (text, length) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

export const formatAudioFeature = (value) => {
  if (value == null) return "0.00";
  return Number(value).toFixed(2);
};
