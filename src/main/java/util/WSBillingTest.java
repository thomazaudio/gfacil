package util;

public class WSBillingTest {
    
    public static void main(String args[]) {
        try {
            // Create request endpoint
            java.security.Security.addProvider(new com.sun.net.ssl.internal.ssl.Provider());
            java.lang.System.setProperty("java.protocol.handler.pkgs", "com.sun.net.ssl.internal.www.protocol");
            java.net.URL endpoint = new java.net.URL("https://www.f2b.com.br/WSBilling");
            
            // Create request message
            javax.xml.soap.MessageFactory mf = javax.xml.soap.MessageFactory.newInstance();
            javax.xml.soap.SOAPMessage request = mf.createMessage();
            // Get message elements
            javax.xml.soap.SOAPPart part = request.getSOAPPart();
            javax.xml.soap.SOAPEnvelope envelope = part.getEnvelope();
            // Remove header
            javax.xml.soap.SOAPHeader header = envelope.getHeader();
            ((javax.xml.soap.Node)header).detachNode();
            // Add content to body
            javax.xml.soap.SOAPBody body = envelope.getBody();
            javax.xml.soap.Name F2bCobrancaName = envelope.createName("F2bCobranca", "m", "http://www.f2b.com.br/soap/wsbilling.xsd");
            javax.xml.soap.SOAPBodyElement F2bCobranca = body.addBodyElement(F2bCobrancaName);
            // Add mensagem
            javax.xml.soap.SOAPElement mensagem = F2bCobranca.addChildElement("mensagem");
            mensagem.addAttribute(envelope.createName("data"), (new java.text.SimpleDateFormat("yyyy-MM-dd")).format(new java.util.Date()));
            mensagem.addAttribute(envelope.createName("numero"), (new java.text.SimpleDateFormat("HHmmss")).format(new java.util.Date()));
            mensagem.addAttribute(envelope.createName("tipo_ws"), "WebService");
            // Add sacador
            javax.xml.soap.SOAPElement sacador = F2bCobranca.addChildElement("sacador");
            sacador.addAttribute(envelope.createName("conta"), "9023010001230123");
            sacador.addTextNode("Jos� da Silva");
            // Add cobranca
            javax.xml.soap.SOAPElement cobranca = F2bCobranca.addChildElement("cobranca");
            cobranca.addAttribute(envelope.createName("valor"), "10.00");
            cobranca.addAttribute(envelope.createName("tipo_cobranca"), ""); 
		// Tipo de cobran�a:
		// B - Boleto; C - Cart�o de cr�dito; D - Cart�o de d�bito; T - Transfer�ncia On-line
		// Caso queira permitir cobran�a por mais de um tipo, enviar as letras juntas. Ex.: "BCD" (Aceitar Boleto, Cr�dito e D�bito)
            cobranca.addAttribute(envelope.createName("num_document"), ""); 
            cobranca.addAttribute(envelope.createName("cod_banco"), ""); 

            cobranca.addChildElement("demonstrativo").addTextNode("Cobran�a F2b");
            cobranca.addChildElement("demonstrativo").addTextNode("Pague em qualquer banco");
            javax.xml.soap.SOAPElement desconto = cobranca.addChildElement("desconto");
            desconto.addAttribute(envelope.createName("valor"), "2.00");
            desconto.addAttribute(envelope.createName("tipo_desconto"), "0");
            desconto.addAttribute(envelope.createName("antecedencia"), "5");
            javax.xml.soap.SOAPElement multa = cobranca.addChildElement("multa");
            multa.addAttribute(envelope.createName("valor"), "1.00");
            multa.addAttribute(envelope.createName("tipo_multa"), "0");
            multa.addAttribute(envelope.createName("valor_dia"), "0.10");
            multa.addAttribute(envelope.createName("tipo_multa_dia"), "0");
            multa.addAttribute(envelope.createName("atraso"), "20");
            // Add agendamento
            javax.xml.soap.SOAPElement agendamento = F2bCobranca.addChildElement("agendamento");
            agendamento.addAttribute(envelope.createName("vencimento"), "2002-11-10");
		//  Descomentar os atributos abaixo caso queria realizar cobran�as com Agendamento //////
            //agendamento.addAttribute(envelope.createName("ultimo_dia"), "n");
            //agendamento.addAttribute(envelope.createName("antecedencia"), "10");
            //agendamento.addAttribute(envelope.createName("periodicidade"), "1");
            //agendamento.addAttribute(envelope.createName("periodos"), "12");
		//  Descomentar os atributos abaixo caso queria realizar cobran�as como Carn� //////
            //agendamento.addAttribute(envelope.createName("carne"), "s");
            //agendamento.addAttribute(envelope.createName("periodos"), "6");
            agendamento.addAttribute(envelope.createName("sem_vencimento"), "n");
            agendamento.addTextNode("Teste 3: direto e agendado");
            // Add sacado
            javax.xml.soap.SOAPElement sacado = F2bCobranca.addChildElement("sacado");
            sacado.addAttribute(envelope.createName("grupo"), "web service");
            sacado.addAttribute(envelope.createName("codigo"), "000001");
            sacado.addAttribute(envelope.createName("envio"), "e");
            sacado.addChildElement("nome").addTextNode("Jos� Oliveira");
            sacado.addChildElement("email").addTextNode("joseoliveira@f2b.com.br");
            sacado.addChildElement("email").addTextNode("joseoliveira@f2b.locaweb.com.br");
            javax.xml.soap.SOAPElement endereco = sacado.addChildElement("endereco");
            endereco.addAttribute(envelope.createName("logradouro"), "Rua das Pedras");
            endereco.addAttribute(envelope.createName("numero"), "245");
            endereco.addAttribute(envelope.createName("complemento"), "sala 34");
            endereco.addAttribute(envelope.createName("bairro"), "Itaim Bibi");
            endereco.addAttribute(envelope.createName("cidade"), "S�o Paulo");
            endereco.addAttribute(envelope.createName("estado"), "SP");
            endereco.addAttribute(envelope.createName("cep"), "04536000");
            javax.xml.soap.SOAPElement telefone = sacado.addChildElement("telefone");
            telefone.addAttribute(envelope.createName("ddd"), "11");
            telefone.addAttribute(envelope.createName("numero"), "35551234");
			javax.xml.soap.SOAPElement telefone_comercial = sacado.addChildElement("telefone_com");
            telefone_comercial.addAttribute(envelope.createName("ddd_com"), "22");
            telefone_comercial.addAttribute(envelope.createName("numero_com"), "22222222");
			javax.xml.soap.SOAPElement telefone_celular = sacado.addChildElement("telefone_celular");
            telefone_celular.addAttribute(envelope.createName("ddd_cel"), "33");
            telefone_celular.addAttribute(envelope.createName("numero_cel"), "33333333");
            sacado.addChildElement("cpf").addTextNode("12345678909");
            sacado = F2bCobranca.addChildElement("sacado");
            sacado.addChildElement("nome").addTextNode("Maria Oliveira");
            sacado.addChildElement("email").addTextNode("mariaoliveira@f2b.com.br");
            sacado = F2bCobranca.addChildElement("sacado");
            sacado.addChildElement("nome").addTextNode("Pedro Oliveira");
            sacado.addChildElement("email").addTextNode("pedrooliveira@f2b.com.br");
System.out.println("request: " + request);
request.writeTo(System.out);
System.out.println("");
            
            // Send request
            javax.xml.soap.SOAPConnectionFactory scf = javax.xml.soap.SOAPConnectionFactory.newInstance();
            javax.xml.soap.SOAPConnection sc = scf.createConnection();
            javax.xml.soap.SOAPMessage response = sc.call(request, endpoint);
System.out.println("response: " + response);
response.writeTo(System.out);
System.out.println("");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
}
