const Stripe = require('stripe');
const stripe = new Stripe('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');

module.exports = {
    async createCustomer(req, res) {
        const { cliente } = req.body;
        console.log('Cliente:', cliente);
        try {
            const customer = await stripe.customers.create({
                ...cliente // Spread o objeto cliente dentro da chamada da função
            });
            console.log('Cliente criado:', customer);
            res.status(200).json({ message: 'Cliente criado com sucesso', cliente: customer});
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            res.status(500).json({ message: 'Erro ao criar cliente' });
        }
    },

    async searchCustomerByCPF(req, res) {
    const { user_CPF: cpf } = req.body;

    try {
        const customers = await stripe.customers.list();
        
        const foundCustomers = customers.data.filter(customer => {
            const customerCPF = customer.metadata.cpf;
            return customerCPF === cpf;
        });

        if (foundCustomers.length > 0) {
            console.log('Clientes encontrados:', foundCustomers);
            res.status(200).json({ customers: foundCustomers });
        } else {
            console.log('Clientes não encontrados');
            res.status(404).json({ message: 'Clientes não encontrados' });
        }
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ message: 'Erro ao buscar clientes' });
    }
},

async createProduto(req, res) {
        const { produto } = req.body;
        console.log('Produto:', produto);
        try {
            const product = await stripe.products.create({
                ...produto // Spread o objeto cliente dentro da chamada da função
            });
            console.log('Produto criado:', product);
            res.status(200).json({ message: 'Produto criado com sucesso', Produto: product});
        
        } catch (error) {
            console.error('Erro ao criar Produto:', error);
            res.status(500).json({ message: 'Erro ao criar Produto' });
        }
    },

    async createSession(req, res) {
        const { cliente: clienteid } = req.body;
        const { produto: prodid } = req.body;
        console.log(prodid)
                try {
                    const session = await stripe.checkout.sessions.create({
                        success_url: 'https://localhost:5173/sistema/pagamento/success',
                        line_items: [
                        {price: prodid, quantity: 1},
                        ],
                        mode: 'payment',
                        customer: clienteid
                    });
                            console.log(prodid)

                    res.status(200).json({ message: 'Checkout criado com sucesso', Sessão: session});
                    res.redirect(303, session.success_url)
                } catch (error) {
                            console.log(prodid)
                    console.error('Erro ao criar Checkout:', error);
                            console.log(prodid)

                }
                
            } 

};
