package usersystem;
import java.sql.SQLException;
import java.util.ArrayList;
import model.GenericControl;
import security.AccountUserDetails;
import security.LoginData;
import security.TokenTransfer;
import security.TokenUtils;
import security.UserDetailServiceImpl;
import transactional.SMS;
import transactional.SMSCache;
import transactional.SendEmail;
import util.AjaxResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.fasterxml.jackson.annotation.JsonView;

import config.Config;
import config.ConfigService;
import database.DataBaseUtil;
import funilceasa.FunilCeasa;
import funilceasa.FunilCeasaDAO;


@Controller
public class UserSystemControl extends GenericControl<UserSystem> {

	@Autowired
	@Qualifier("authenticationManager")
	private AuthenticationManager authManager;

	@Autowired
	private UserDetailServiceImpl userDetailService;
	
	
	@Autowired
	private ConfigService configService;

	//Convert um card em u objeto FunilCeasa
	public FunilCeasa cardDescToFunil(CardDesc card) throws SQLException{

		FunilCeasa funil = new FunilCeasa();
		funil.setNome(card.getNome());
		funil.setLogin(card.getLogin());
		funil.setEmail(card.getEmail());
		funil.setProdutos(card.getProdutosComercializados());
		funil.setTelefone(card.getTelefone());
		funil.setFormaContato(card.getFormaContato());
		funil.setEndereco(card.getEndereco());

		return funil;
	}



	//Origem a aprtir do funcil do trello
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/funilceasa-interessou/add/", method= RequestMethod.POST)
	public AjaxResponse<UserSystem> addFunilCeasaNaoInteressou(@RequestBody CardDesc cardDesc) {


		try {

			FunilCeasa funil =  cardDescToFunil(cardDesc);
			funil.setInteressouPrimeiroContato(FunilCeasa.INTERESSOU_PRIMEIRO_CONTATO);
			new FunilCeasaDAO().add(funil);

			//Envia email
			new SendEmail().enviaEmailCadastroUsuario(funil);

			if(cardDesc.getFormaContato().equals("SMS"))
			  new SMS().enviaSMSApresentacaoSistema(funil);
			else
			  new SMS().enviaSMSCadastroUsuario(funil);

		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}



		return null;
	}

	//Origem a partir do funil do trello
	//Não se interessou no primeiro contato
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/funilceasa-naointeressou/add/", method= RequestMethod.POST)
	public AjaxResponse<UserSystem> addFunilCeasaInteressou(@RequestBody CardDesc cardDesc) {

		try {

			FunilCeasa funil =  cardDescToFunil(cardDesc);
			funil.setInteressouPrimeiroContato(FunilCeasa.NAO_INTERESSOU_PRIMEIRO_CONTATO);
			new FunilCeasaDAO().add(funil);

			//Quando não há interesse inicial do usuário, envia apenas SMS
			new SMS().enviaSMSUsuarioNaoInteressou(funil);

		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		return null;
	}
	
	
		@JsonView(util.Views.Public.class)
		@ResponseBody
		@RequestMapping(value="/uso-gratuito/add/", method= RequestMethod.POST)
		public AjaxResponse<UserSystem> addUsoGratuito(@RequestBody CardDesc cardDesc) {

			try {

				FunilCeasa funil =  cardDescToFunil(cardDesc);
				funil.setInteressouPrimeiroContato(FunilCeasa.NAO_INTERESSOU_PRIMEIRO_CONTATO);
				new FunilCeasaDAO().add(funil);

				new SMS().enviaSMSUsoGratuito(funil);

			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			return null;
		}



	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cadastrar-usuario", method= RequestMethod.GET)
	public AjaxResponse<FunilCeasa> cadastrarUsuario(@RequestParam String login) {


		

		AjaxResponse<FunilCeasa> res= new AjaxResponse<FunilCeasa>();


		//Somente se o schema para  o usuário ainda não foi criado
		//Recupera o usuário de acordo com o 'login' informado em user
		try {

			FunilCeasa funil= new  FunilCeasaDAO().getUserByPhone(login);


			//Caso o usuário não esteja cadastro no funil
			if(funil==null){

				funil = new FunilCeasa();
				funil.setNome("");
				funil.setEmail("");
				funil.setTelefone(login);
			}


			res.setItem(funil);

			UserSystem user = new UserSystem();
			user.setNome(funil.getNome());
			user.setLogin(funil.getTelefone());
			user.setEmail(funil.getEmail());

			//Adiciona um novo schema no sistema
			new DataBaseUtil().createSchema(user,"ceasa",funil.getProdutos());

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


		return res;
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/get-smscache/", method= RequestMethod.GET)
	public AjaxResponse<SMS> getSmsCache() {

		AjaxResponse<SMS> res= new  AjaxResponse<SMS>();
		res.setItens(SMSCache.cacheSms);

		//Limpa o cache
		SMSCache.cacheSms = new ArrayList<SMS>();
		return res;
	}



	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/user/login/", method= RequestMethod.POST)
	public TokenTransfer  login(@RequestBody LoginData item) {

		String usuario = item.getUsuario()+"@"+item.getEmpresa();
		SecurityContextHolder.getContext().setAuthentication(null);
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(usuario, item.getSenha());
		Authentication authentication = this.authManager.authenticate(authenticationToken);
		AccountUserDetails userDetails = userDetailService.loadUserByUsername(usuario);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		Config configUsuario = configService.getAll().get(0);
		return new TokenTransfer(TokenUtils.createToken(userDetails),userDetails.getAccount(),configUsuario);

	}

	@Override
	public AjaxResponse<UserSystem> addOrUpdate(UserSystem item) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<UserSystem> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<UserSystem> getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<UserSystem> getLike(String propriedade, String query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<UserSystem> delete(long[] ids) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<UserSystem> getLikeMap(String[] qs, int pagina, int max, String extra) {
		// TODO Auto-generated method stub
		return null;
	}



}
