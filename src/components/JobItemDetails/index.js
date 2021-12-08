import {Component} from 'react'
import {BsFillStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import {MdLocationOn} from 'react-icons/md'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const statusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    skills: [],
    lifeAtCompany: {},
    detailsStatus: '',
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({detailsStatus: statusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const getDetails = await fetch(url, options)
    const detailsJsonData = await getDetails.json()
    if (getDetails.ok === true) {
      const jobDetails = detailsJsonData.job_details
      const similarJobs = detailsJsonData.similar_jobs
      const newObj = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        skills: jobDetails.skills.map(item => ({
          imageUrl: item.image_url,
          name: item.name,
        })),
        lifeAtCompany: {
          description: jobDetails.life_at_company.description,
          imageUrl: jobDetails.life_at_company.image_url,
        },
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
      }
      const newArrayObj = similarJobs.map(jobs => ({
        companyLogoUrl: jobs.company_logo_url,
        employmentType: jobs.employment_type,
        id: jobs.id,
        jobDescription: jobs.job_description,
        location: jobs.location,
        rating: jobs.rating,
        title: jobs.title,
      }))
      this.setState({
        jobDetails: newObj,
        skills: newObj.skills,
        lifeAtCompany: newObj.lifeAtCompany,
        similarJobs: newArrayObj,
        detailsStatus: statusConstants.success,
      })
    } else {
      this.setState({detailsStatus: statusConstants.failure})
    }
  }

  retryJobDetails = () => {
    this.getJobDetails()
  }

  returnSkillsItem = () => {
    const {skills} = this.state

    return skills.map(items => (
      <li className="skills-li" key={items.name}>
        <img src={items.imageUrl} alt={items.name} className="skills-logo" />
        <p>{items.name}</p>
      </li>
    ))
  }

  renderSimilarJobView = item => {
    const {
      companyLogoUrl,
      title,
      rating,
      jobDescription,
      location,
      employmentType,
      id,
    } = item
    return (
      <li className="similar-job-view" key={id}>
        <div className="title-logo-cont">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="detail-view-logo"
          />
          <div className="title-rating-cont">
            <h2>{title}</h2>
            <p className="rating-para">
              <BsFillStarFill className="rating-star" />
              {rating}
            </p>
          </div>
        </div>
        <h1>Description</h1>
        <p className="similar-desc">{jobDescription}</p>
        <div className="location-type-cont">
          <div className="location-cont">
            <MdLocationOn className="location-icon" />
            <p>{location}</p>
          </div>
          <div className="location-cont">
            <BsFillBriefcaseFill className="location-icon" />
            <p>{employmentType}</p>
          </div>
        </div>
      </li>
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
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.retryJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderForJobs = () => (
    <div testid="loader" className="loader-cont">
      <Loader type="ThreeDots" color="#ff0b37" height={50} width={50} />
    </div>
  )

  renderSuccessfullDetails = () => {
    const {jobDetails, lifeAtCompany, similarJobs} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyWebsiteUrl,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="job-details-success-bg">
        <div className="job-detail-view-cont">
          <div className="title-logo-cont">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="detail-view-logo"
            />
            <div className="title-rating-cont">
              <h2>{title}</h2>
              <p className="rating-para">
                <BsFillStarFill className="rating-star" />
                {rating}
              </p>
            </div>
          </div>
          <div className="location-type-package-cont">
            <div className="location-type-cont">
              <div className="location-cont">
                <MdLocationOn className="location-icon" />
                <p>{location}</p>
              </div>
              <div className="location-cont">
                <BsFillBriefcaseFill className="location-icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr />
          <div>
            <div className="visit-desc-cont">
              <h1 className="description-detail">Description</h1>
              <a
                href={companyWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="anchor"
              >
                Visit
                <BiLinkExternal />
              </a>
            </div>
            <p className="detail-description-para">{jobDescription}</p>
          </div>
          <div>
            <h1 className="skills">Skills</h1>
            <ul className="skill-ul">{this.returnSkillsItem()}</ul>
          </div>
          <div className="life-at-company-cont">
            <div className="life-at-desc-cont">
              <h2 className="life-at-company">Life at Company </h2>
              <p className="life-at-desc">{description}</p>
            </div>
            <div className="life-at-image">
              <img src={imageUrl} alt="life at company" className="life-img" />
            </div>
          </div>
        </div>
        <h1 className="similar-head">Similar Jobs</h1>
        <ul className="similar-job-item-cont">
          {similarJobs.map(items => this.renderSimilarJobView(items))}
        </ul>
      </div>
    )
  }

  renderDetailsBasedOnStatus = () => {
    const {detailsStatus} = this.state
    switch (detailsStatus) {
      case statusConstants.failure:
        return this.renderJobsFailure()
      case statusConstants.success:
        return this.renderSuccessfullDetails()
      case statusConstants.inProgress:
        return this.renderLoaderForJobs()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderDetailsBasedOnStatus()}
      </>
    )
  }
}

export default JobItemDetails
