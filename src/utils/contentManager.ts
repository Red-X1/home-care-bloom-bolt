
// Этот файл теперь устарел - весь контент управляется через Supabase
// Сохраняем только для обратной совместимости

console.warn('contentManager.ts устарел - используйте useSiteSections хук для работы с Supabase');

export interface SiteContent {
  // Интерфейсы оставляем для совместимости
}

export const getContent = () => {
  console.warn('getContent() устарел - используйте useSiteSections хук');
  return {};
};

export const saveContent = () => {
  console.warn('saveContent() устарел - используйте useSiteSections хук');
};

export const resetContent = () => {
  console.warn('resetContent() устарел - используйте useSiteSections хук');
};
