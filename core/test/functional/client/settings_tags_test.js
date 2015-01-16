// # Tag Test
// Test the various parts of the Tag page

/*globals CasperTest, casper, $*/

CasperTest.begin('Tag screen is correct', 9, function suite(test) {
    casper.thenOpenAndWaitForPageLoad('settings.tags', function testTitleAndUrl() {
        test.assertTitle('Settings - Tags - Test Blog', 'Ghost admin has incorrect title');
        test.assertUrlMatch(/ghost\/settings\/tags\/$/, 'Landed on the correct URL');
    });

    // Check if tag list is on the page
    casper.then(function testTagsList() {
        test.assertExists('.settings-tags', 'Tags list is present');
        test.assertExists('.settings-tag', 'Tags list item is present');
    });

    
    casper.thenClick('.settings-tags .settings-tag:nth-of-type(1) button');

    // Check if tag settings menu open correctly
    // How to assert TSM is opened..
    casper.waitUntilVisible('.content-cover', function onSuccess() {
        test.assertSelectorHasText(
            '.settings-menu .settings-menu-header',
            'Tag Settings',
            'Tag settings menu has correct text');

        test.assertExists('.settings-menu-header .close');
    });

    // Change the content
    casper.then(function fillContent() {
        casper.sendKeys('.settings-menu-content form input:nth-of-type(1)', 'changed tag Title', {reset: true});
        casper.click('.settings-menu-content');
    });

    casper.waitForResource(/\/tags\/\d+\//, function testGoodResponse(resource) {
        test.assert(resource.status < 400);
    });

    // Text in the list should equals 
    casper.then(function checkTagNameInput() {
        test.assertEvalEquals(function () {
            return $('.settings-tags .settings-tag:nth-of-type(1) .tag-title').html();
        }, 'changed tag Title', 'Tag input should match expected value.');
    });

    casper.thenClick('.settings-menu-header .close');

    casper.waitWhileVisible('.content-cover', function onSuccess() {
        test.assert(true, 'Check if TSM close correctly');
    });

});