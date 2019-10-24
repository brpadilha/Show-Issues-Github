import React, {Component} from 'react'

import { FaGithubAlt, FaPlus, FaSpinner} from 'react-icons/fa'
import { Link} from 'react-router-dom'
import Container from '../../components/Container/index'
import { Form, SubmitButton, List} from './styles'

import api from '../../services/api'

export default class Main extends Component{
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  }




  //Salvar os dados do localStorage
  componentDidUpdate(_, prevState){
    const {repositories} = this.state;

    if(prevState.repositories !== repositories){
      localStorage.setItem('repositories', JSON.stringify(repositories))
    }
  }

  //Carregar os dados do localStorage
  componentDidMount(){
    const repositories = localStorage.getItem('repositories');

    if(repositories){
      this.setState({repositories: JSON.parse(repositories)})
    }
  }

  handleInputChange= e =>{
    this.setState({newRepo: e.target.value})
  }
  handleSubmit = async e =>{
    e.preventDefault();
    this.setState({loading: true})

    const { newRepo, repositories } = this.state
    const response = await api.get(`/repos/${newRepo}`)

    const data = {
      name: response.data.full_name
    }

    this.setState({
      repositories: [...repositories,data],
      newRepo: '',
      loading: false,
    })
  };
  render(){
    const {newRepo, loading, repositories} = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt/>
          Repositórios
          </h1>

          <Form onSubmit={this.handleSubmit}>
            <input
            type='text'
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
            />

          <SubmitButton loading={loading ? 1 : 0}>

            { loading ?
            (<FaSpinner color= "#fff" size={14}/> //se o loading for verdadeiro, mostrar esse botao
              )  : (
              <FaPlus color='#fff' size={14}/> // se o loading for falso, mostrar esse botão
            )}

          </SubmitButton>
          </Form>

          <List>
                {repositories.map(repositoriy=>(
                  <li key={repositoriy.name}>
                    <span>{repositoriy.name}</span>
                    <Link to={`/repository/${encodeURIComponent(repositoriy.name)}`}>Detalhes</Link>
                  </li>
                ))}
          </List>
      </Container>
    )

  }
}

