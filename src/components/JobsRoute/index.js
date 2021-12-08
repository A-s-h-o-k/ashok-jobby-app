import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const statusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class Jobs extends Component {
  state = {
    profileDetails: {},
    profileStatus: statusConstants.inProgress,
    employmentType: [],
    salaryRange: '',
    jobsList: [],
    jobStatus: statusConstants.inProgress,
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  getProfileDetails = async () => {
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const getDetails = await fetch(url, options)
    const profileDetails = await getDetails.json()
    if (getDetails.ok === true) {
      const detailsObj = {
        name: profileDetails.profile_details.name,
        profileImageUrl: profileDetails.profile_details.profile_image_url,
        bio: profileDetails.profile_details.short_bio,
      }
      this.setState({
        profileStatus: statusConstants.success,
        profileDetails: detailsObj,
      })
    } else {
      this.setState({profileStatus: statusConstants.failure})
    }
  }

  getJobsList = async () => {
    this.setState({jobStatus: statusConstants.inProgress})
    const {searchInput, salaryRange, employmentType} = this.state
    const employmentTypeJoin = employmentType.join(',')
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

  retryProfile = () => {
    this.getProfileDetails()
  }

  retryJobsUrl = () => {
    this.getJobsList()
  }

  renderLoader = () => (
    <div testid="loader" className="jobs-profile-loader-cont">
      <Loader type="ThreeDots" color="#6366f1" height={50} width={50} />
    </div>
  )

  renderProfileDetails = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, bio} = profileDetails

    return (
      <div className="jobs-profile-cont">
        <img src={profileImageUrl} alt="profile" />
        <h2 className="profile-name">{name}</h2>
        <p className="profile-bio">{bio}</p>
      </div>
    )
  }

  renderProfileFailure = () => (
    <div className="profile-failure-view">
      <button
        type="button"
        className="failure-button"
        onClick={this.retryProfile}
      >
        Retry
      </button>
    </div>
  )

  renderProfileDetailsStatus = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case statusConstants.inProgress:
        return this.renderLoader()
      case statusConstants.success:
        return this.renderProfileDetails()
      case statusConstants.failure:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  changeInputValue = event => {
    this.setState({searchInput: event.target.value})
  }

  renderJobsOnSearchButton = () => {
    this.getJobsList()
  }

  renderTypeOfEmployment = () => {
    const {employmentType} = this.state
    const employmentTypeChange = event => {
      if (employmentType.includes(event.target.value)) {
        this.setState(
          prev => ({
            employmentType: [
              ...prev.employmentType.filter(
                item => item !== event.target.value,
              ),
            ],
          }),
          this.getJobsList,
        )
      } else {
        this.setState(
          prev => ({
            employmentType: [...prev.employmentType, event.target.value],
          }),
          this.getJobsList,
        )
      }
    }

    return (
      <ul className="employment-type-ul">
        {employmentTypesList.map(item => (
          <li key={item.employmentTypeId}>
            <input
              type="checkbox"
              id={item.employmentTypeId}
              value={item.employmentTypeId}
              onChange={employmentTypeChange}
              className="type-input"
            />
            <label htmlFor={item.employmentTypeId}>{item.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  renderSalaryRange = () => {
    const salaryChange = event => {
      this.setState({salaryRange: event.target.value}, this.getJobsList)
    }

    return (
      <ul className="employment-type-ul">
        {salaryRangesList.map(item => (
          <li key={item.salaryRangeId}>
            <input
              type="radio"
              id={item.salaryRangeId}
              value={item.salaryRangeId}
              onChange={salaryChange}
              className="type-input"
              name="radio"
            />
            <label htmlFor={item.salaryRangeId}>{item.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  renderFilterCont = () => (
    <div className="filter-cont">
      {this.renderProfileDetailsStatus()}
      <hr />
      <div>
        <h1 className="type-of-employment">Type of Employment</h1>
        {this.renderTypeOfEmployment()}
      </div>
      <hr />
      <div>
        <h1 className="type-of-employment">Salary Ranges</h1>
        {this.renderSalaryRange()}
      </div>
    </div>
  )

  renderLoaderForJobs = () => (
    <div testid="loader" className="loader-cont">
      <Loader type="ThreeDots" color="#fbbf24" height={50} width={50} />
    </div>
  )

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
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.retryJobsUrl}
      >
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="job-failure-vew-bg">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="failure-heading">No Jobs Found</h1>
      <p className="failure-desc">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderJobsBasedOnStatus = () => {
    const {jobStatus, jobsList} = this.state
    const lengthOfJobsList = jobsList.length
    switch (jobStatus) {
      case statusConstants.inProgress:
        return this.renderLoaderForJobs()
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

  renderJobsCont = () => {
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
            testid="searchButton"
          >
            <BsSearch />
          </button>
        </div>
        {this.renderJobsBasedOnStatus()}
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-bg">
          {this.renderFilterCont()}
          {this.renderJobsCont()}
        </div>
      </>
    )
  }
}

export default Jobs
