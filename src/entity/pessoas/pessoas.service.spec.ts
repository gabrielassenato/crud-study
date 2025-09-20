describe('PessoasService', () => {
    beforeEach(async () => {
    //    console.log('Setup before each test'); 
    });
    // Caso - teste
    it('Alguma coisa', () => {
        // Configurar
        // Fazer alguma ação
        // Conferir se essa ação foi esperada
    });

    // ou
    // Caso - teste
    test('deve somar o numero 1 e o numero 2 e resultar em 3', () => {
        // Configurar - Arrange
        const numero1 = 1;
        const numero2 = 2;
        // Fazer alguma ação - Act
        const resultado = numero1 + numero2;
        // Conferir se essa ação foi esperada - Assert
        // === 3 = toBe
        expect(resultado).toBe(3);
    });
});