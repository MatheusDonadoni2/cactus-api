export interface UseCaseError {
  name?: string; // 'Nome Do Erro';
  action?: string; // 'Mensagem recomendando fazer alguma ação';
  statusCode?: number;
}
