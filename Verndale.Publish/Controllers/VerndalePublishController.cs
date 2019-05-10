using System.Linq;
using EPiServer.PlugIn;
using System.Web.Mvc;
using EPiServer;
using EPiServer.Core;
using EPiServer.DataAccess;
using EPiServer.Security;

namespace Verndale.Publish.Controllers
{
    [Authorize(Roles = "WebEditors, WebAdmins, Administrators")]
    public class VerndalePublishController : Controller
    {
        #region Properties

        private readonly IContentRepository ContentRepository;
        private readonly IContentLoader ContentLoader;
        private readonly IContentVersionRepository ContentVersionRepository;

        #endregion

        #region Constructor

        public VerndalePublishController(IContentRepository contentRepository, IContentLoader contentLoader,
            IContentVersionRepository contentVersionRepository)
        {
            ContentRepository = contentRepository;
            ContentLoader = contentLoader;
            ContentVersionRepository = contentVersionRepository;
        }

        #endregion

        public ActionResult Index(string id)
        {
            var contextContentLink = PageReference.Parse(id);
            PublishItem(contextContentLink);

            var descendents = ContentRepository.GetDescendents(contextContentLink);
            foreach (var descendent in descendents)
            {
                PublishItem(descendent);
            }

            // Return identifier to the updated version of the page, i.e. page ID including work ID
            return new JsonResult { Data = id };
        }

        #region Private Methods

        private void PublishItem(ContentReference contentLink)
        {
            //  get the latest published version, not the latest saved version.
            var versions = ContentVersionRepository.List(contentLink).OrderByDescending(p => p.Saved);
            var latestVersion = versions.FirstOrDefault(p => p.Status == VersionStatus.CheckedOut);

            if (latestVersion != null)
            {
                var pageUnpublished = ContentLoader.Get<PageData>(latestVersion.ContentLink).CreateWritableClone();

                //var action = pageUnpublished.CheckPublishedStatus(PagePublishedStatus.Published)
                //    ? SaveAction.Publish
                //    : SaveAction.Save;

                var action = SaveAction.Publish;
                action = action | SaveAction.ForceCurrentVersion;

                ContentRepository.Save(pageUnpublished, action, AccessLevel.NoAccess);
            }
        }

        #endregion
    }
}