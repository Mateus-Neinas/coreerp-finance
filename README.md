# CoreERP Finance

Módulo de domínio para contas a pagar e receber de uma plataforma ERP genérica.

## O que faz

- Soma valores em centavos inteiros, sem usar ponto flutuante para dinheiro.
- Resume contas abertas, valores recebidos, valores pagos e itens vencidos.
- Ignora lançamentos cancelados.
- Exige datas no formato ISO (`AAAA-MM-DD`) e valida os dados antes de agregar.

## Executar

Requer Node.js 20 ou superior.

```bash
npm test
```

## Função principal

- `summarizeEntries(entries, asOfDate)`: retorna totais de recebíveis, pagáveis, liquidados e vencidos.

Os registros finais ficarão na tabela `financial_entries` do repositório `coreerp-database`. Esta biblioteca ainda trabalha com dados fornecidos pelo chamador; não acessa PostgreSQL diretamente.
