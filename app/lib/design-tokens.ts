// Design Tokens for consistent styling across the dashboard
export const DESIGN_TOKENS = {
  // Colors - Primary
  colors: {
    primary: {
      50: 'bg-indigo-50 dark:bg-indigo-950',
      100: 'bg-indigo-100 dark:bg-indigo-900',
      200: 'bg-indigo-200 dark:bg-indigo-800',
      600: 'bg-indigo-600 dark:bg-indigo-500',
      700: 'bg-indigo-700 dark:bg-indigo-600',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-600 dark:border-indigo-500',
    },
    secondary: {
      50: 'bg-gray-50 dark:bg-gray-900',
      100: 'bg-gray-100 dark:bg-gray-800',
      200: 'bg-gray-200 dark:bg-gray-700',
      600: 'bg-gray-600 dark:bg-gray-400',
      700: 'bg-gray-700 dark:bg-gray-300',
      800: 'bg-gray-800 dark:bg-gray-200',
      text: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-300 dark:border-gray-600',
    },
    success: {
      50: 'bg-green-50 dark:bg-green-950',
      100: 'bg-green-100 dark:bg-green-900',
      600: 'bg-green-600 dark:bg-green-500',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-300 dark:border-green-600',
    },
    warning: {
      50: 'bg-yellow-50 dark:bg-yellow-950',
      100: 'bg-yellow-100 dark:bg-yellow-900',
      600: 'bg-yellow-600 dark:bg-yellow-500',
      text: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-300 dark:border-yellow-600',
    },
    error: {
      50: 'bg-red-50 dark:bg-red-950',
      100: 'bg-red-100 dark:bg-red-900',
      600: 'bg-red-600 dark:bg-red-500',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-300 dark:border-red-600',
    },
    blue: {
      50: 'bg-blue-50 dark:bg-blue-950',
      100: 'bg-blue-100 dark:bg-blue-900',
      600: 'bg-blue-600 dark:bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-300 dark:border-blue-600',
    },
  },

  // Spacing
  spacing: {
    xs: 'gap-2',
    sm: 'gap-3 sm:gap-4',
    md: 'gap-6 sm:gap-8',
    lg: 'gap-8 sm:gap-12',
  },

  // Padding
  padding: {
    card: 'p-4 sm:p-6 lg:p-8',
    section: 'px-4 sm:px-6 lg:px-8 py-6 sm:py-8',
    input: 'p-3 sm:p-4',
    button: 'py-2 sm:py-3 px-4 sm:px-6',
  },

  // Border radius
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
  },

  // Shadows
  shadow: {
    sm: 'shadow-md',
    md: 'shadow-lg',
    lg: 'shadow-xl',
  },

  // Borders
  border: {
    light: 'border border-gray-200 dark:border-gray-700',
    default: 'border border-gray-300 dark:border-gray-600',
  },

  // Backdrop
  backdrop: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',

  // Typography
  typography: {
    h1: 'text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white',
    h2: 'text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white',
    h3: 'text-xl font-bold text-gray-900 dark:text-white',
    h4: 'text-lg font-bold text-gray-900 dark:text-white',
    body: 'text-base text-gray-700 dark:text-gray-300',
    bodySmall: 'text-sm text-gray-600 dark:text-gray-400',
    bodyXs: 'text-xs text-gray-500 dark:text-gray-500',
  },

  // Transitions
  transition: 'transition-colors duration-300',

  // Breakpoints (for reference)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

// Card styles
export const CARD_STYLE = `${DESIGN_TOKENS.backdrop} ${DESIGN_TOKENS.border.light} ${DESIGN_TOKENS.radius.lg} ${DESIGN_TOKENS.shadow.md} ${DESIGN_TOKENS.padding.card} ${DESIGN_TOKENS.transition}`;

// Button styles
export const BUTTON_PRIMARY = `bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold ${DESIGN_TOKENS.padding.button} ${DESIGN_TOKENS.radius.sm} ${DESIGN_TOKENS.transition} disabled:opacity-50 disabled:cursor-not-allowed`;

export const BUTTON_SECONDARY = `bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold ${DESIGN_TOKENS.padding.button} ${DESIGN_TOKENS.radius.sm} ${DESIGN_TOKENS.transition}`;

// Input styles
export const INPUT_STYLE = `w-full ${DESIGN_TOKENS.border.default} ${DESIGN_TOKENS.radius.sm} ${DESIGN_TOKENS.padding.input} text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400`;

// Label styles
export const LABEL_STYLE = 'block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2';

// Section styles
export const SECTION_STYLE = `${DESIGN_TOKENS.padding.section}`;
