Estado do comercio map fix:
- Accordion por categoria implementado e funcionando (9 grupos, 15 cada).
- O iframe do Google Maps com AIzaSyBIe8w1n6rjV3xJn... está BLANK (chave inválida). A chave real está em server/_core/env.ts via BUILT_IN_FORGE_API_KEY (maps proxy do template).
- Solução usada no Servicos.tsx: usa MapView de @/components/Map com onMapReady e cria markers programaticamente.
- commerceCoords e mapMarkers foram calculados com hash (placeholder pois lat/lng do DB está NULL para todos os 135 registros).
- Próximo passo: substituir o iframe pela MapView do componente Map.tsx (que usa o proxy de chave do template).
