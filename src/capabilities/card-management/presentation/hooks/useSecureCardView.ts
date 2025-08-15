import { useState, useCallback } from 'react';
import {
  GenerateSecureTokenUseCase,
  ShowSecureCardViewUseCase,
} from '../../domain/use-cases';
import {
  TokenRepositoryImpl,
  SecureCardBridgeImpl,
} from '../../infrastructure/repositories';

interface SecureCardViewState {
  loading: boolean;
  error: string | null;
}

export const useSecureCardView = () => {
  const [state, setState] = useState<SecureCardViewState>({
    loading: false,
    error: null,
  });

  const generateTokenUseCase = new GenerateSecureTokenUseCase(
    new TokenRepositoryImpl(),
  );
  const showSecureViewUseCase = new ShowSecureCardViewUseCase(
    new SecureCardBridgeImpl(),
  );

  const showSecureCard = useCallback(
    async (cardId: string) => {
      try {
        setState({ loading: true, error: null });
        console.log('Starting secure card view process for:', cardId);

        // 1. Generar token seguro
        console.log('Generating secure token...');
        const secureToken = await generateTokenUseCase.execute(cardId);
        console.log('Token generated successfully');

        // 2. Mostrar vista segura
        console.log('Opening secure view...');
        const result = await showSecureViewUseCase.execute({
          cardId,
          token: secureToken.token,
        });

        if (!result.success) {
          throw new Error(result.error || 'Failed to show secure view');
        }

        console.log('Secure view opened successfully');
        setState({ loading: false, error: null });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        console.error('Error in secure card view process:', err);
        setState({
          loading: false,
          error: errorMessage,
        });
      }
    },
    [generateTokenUseCase, showSecureViewUseCase],
  );

  return {
    ...state,
    showSecureCard,
  };
};
