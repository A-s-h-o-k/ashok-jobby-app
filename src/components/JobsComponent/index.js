import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import JobItem from '../JobItem'
import './index.css'

const statusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobsComponent extends Component {
  state = {searchInput: '', jobStatus: statusConstants.inProgress, jobsList: []}

  componentDidMount() {
    this.getJobsList()
  }

  getJobsList = async () => {
    this.setState({jobStatus: statusConstants.inProgress})
    const {searchInput} = this.state
    const {salaryRange, employmentTypes} = this.props
    const employmentTypeJoin = employmentTypes.join(',')
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeJoin}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const fetchJobsList = await fetch(url, options)
    const jobsJsonData = await fetchJobsList.json()
    if (fetchJobsList.ok === true) {
      const convertedList = jobsJsonData.jobs.map(each => ({
        id: each.id,
        employmentType: each.employment_type,
        companyLogoUrl: each.company_logo_url,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState(
        {
          jobsList: convertedList,
          jobStatus: statusConstants.success,
        },
        this.renderJobsBasedOnStatus,
      )
    } else {
      this.setState({jobStatus: statusConstants.failure})
    }
  }

  changeInputValue = event => {
    this.setState({searchInput: event.target.value})
  }

  renderLoaderForJobs = () => (
    <div testid="loader" className="loader-cont">
      <Loader type="ThreeDots" color="#fbbf24" height={50} width={50} />
    </div>
  )

  renderJobsOnSearchButton = () => {
    this.getJobsList()
  }

  renderJobsList = () => {
    const {jobsList} = this.state

    return (
      <ul className="job-items-ul">
        {jobsList.map(item => (
          <JobItem details={item} key={item.id} />
        ))}
      </ul>
    )
  }

  renderJobsFailure = () => (
    <div className="job-failure-vew-bg">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">!Oops Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page your looking for.
      </p>
      <button type="button" className="retry-button">
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="job-failure-vew-bg">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">No Jobs Found</h1>
      <p className="failure-desc">
        We could not find any jobs. Try other filter
      </p>
    </div>
  )

  renderJobsBasedOnStatus = () => {
    const {jobStatus, jobsList} = this.state
    const lengthOfJobsList = jobsList.length
    switch (jobStatus) {
      case statusConstants.inProgress:
        return this.renderLoader()
      case statusConstants.success:
        return lengthOfJobsList > 0
          ? this.renderJobsList()
          : this.renderNoJobsView()
      case statusConstants.failure:
        return this.renderJobsFailure()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="job-successfull-bg">
        <div className="search-job-cont">
          <input
            type="search"
            className="job-search-ele"
            onChange={this.changeInputValue}
            value={searchInput}
          />
          <button
            type="button"
            className="search-icon-button"
            onClick={this.renderJobsOnSearchButton}
          >
            <BsSearch />
          </button>
        </div>
        {this.renderJobsBasedOnStatus()}
      </div>
    )
  }
}

export default JobsComponent
