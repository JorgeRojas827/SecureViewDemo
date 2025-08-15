import { useState, useCallback, useMemo } from 'react';
import {
  GenerateSecureTokenUseCase,
  ShowSecureCardViewUseCase,
} from '../../domain/use-cases';
import {
  TokenRepositoryImpl,
  SecureCardBridgeImpl,
} from '../../infrastructure/repositories';

interface SecureCardViewState {
  loadingCardId: string | null;
  error: string | null;
}

export const useSecureCardView = () => {
  const [state, setState] = useState<SecureCardViewState>({
    loadingCardId: null,
    error: null,
  });

  const generateTokenUseCase = useMemo(
    () => new GenerateSecureTokenUseCase(new TokenRepositoryImpl()),
    []
  );

  const showSecureViewUseCase = useMemo(
    () => new ShowSecureCardViewUseCase(new SecureCardBridgeImpl()),
    []
  );

  const showSecureCard = useCallback(
    async (cardId: string) => {
      try {
        setState({ loadingCardId: cardId, error: null });

        const secureToken = await generateTokenUseCase.execute(cardId);
        const result = await showSecureViewUseCase.execute({
          cardId,
          token: secureToken.token,
        });

        if (!result.success) {
          throw new Error(result.error || 'Failed to show secure view');
        }

        setState({ loadingCardId: null, error: null });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setState({
          loadingCardId: null,
          error: errorMessage,
        });
      }
    },
    [generateTokenUseCase, showSecureViewUseCase]
  );

  const isLoadingCard = useCallback(
    (cardId: string) => state.loadingCardId === cardId,
    [state.loadingCardId]
  );

  return {
    loadingCardId: state.loadingCardId,
    loading: state.loadingCardId !== null,
    error: state.error,
    showSecureCard,
    isLoadingCard,
  };
};
