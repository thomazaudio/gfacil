package pedido;
import java.util.List;

public class PedidoUtil {

	public double getTotalPedidos(List<Pedido> pedidos){
		
		double total = 0;
		
		for(Pedido p : pedidos){
			total+=p.getValorUnitario()*p.getQuantidade();
		}
		
		return total;
		
	}
}
