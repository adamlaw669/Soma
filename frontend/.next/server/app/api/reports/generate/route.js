/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/reports/generate/route";
exports.ids = ["app/api/reports/generate/route"];
exports.modules = {

/***/ "(rsc)/./app/api/reports/generate/route.ts":
/*!*******************************************!*\
  !*** ./app/api/reports/generate/route.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nanoid */ \"(rsc)/./node_modules/nanoid/index.js\");\n\n\n// In-memory store for demo\nconst memory = global.__SOMA_REPORTS__ || {\n    reports: []\n};\nglobal.__SOMA_REPORTS__ = memory;\nasync function POST(req) {\n    try {\n        const body = await req.json();\n        const nowIso = new Date().toISOString();\n        const id = (0,nanoid__WEBPACK_IMPORTED_MODULE_1__.nanoid)(12);\n        const report = {\n            id,\n            patient_session_id: body.session.sessionId,\n            generated_at: nowIso,\n            predicted: {\n                label: body.predict_response.top_prediction.label,\n                probability: body.predict_response.top_prediction.probability\n            },\n            distribution: body.predict_response.distribution,\n            triage: body.predict_response.triage,\n            advice: body.predict_response.advice,\n            explanations: body.predict_response.explanations,\n            llm_summary: body.recent_reports && body.recent_reports.length > 0 ? `Context-aware summary referencing ${body.recent_reports.length} prior report(s).` : \"Concise clinical summary based on current inputs.\",\n            status: \"pending\"\n        };\n        memory.reports.push(report);\n        const response = {\n            report\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(response);\n    } catch (err) {\n        return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(`Error: ${err?.message ?? \"unknown\"}`, {\n            status: 400\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3JlcG9ydHMvZ2VuZXJhdGUvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBDO0FBQ1g7QUFHL0IsMkJBQTJCO0FBQzNCLE1BQU1FLFNBQWdDLE9BQWdCRSxnQkFBZ0IsSUFBSTtJQUFFQyxTQUFTLEVBQUU7QUFBQztBQUN0RkYsT0FBZUMsZ0JBQWdCLEdBQUdGO0FBRTdCLGVBQWVJLEtBQUtDLEdBQVk7SUFDckMsSUFBSTtRQUNGLE1BQU1DLE9BQVEsTUFBTUQsSUFBSUUsSUFBSTtRQUU1QixNQUFNQyxTQUFTLElBQUlDLE9BQU9DLFdBQVc7UUFDckMsTUFBTUMsS0FBS1osOENBQU1BLENBQUM7UUFFbEIsTUFBTWEsU0FBaUI7WUFDckJEO1lBQ0FFLG9CQUFvQlAsS0FBS1EsT0FBTyxDQUFDQyxTQUFTO1lBQzFDQyxjQUFjUjtZQUNkUyxXQUFXO2dCQUNUQyxPQUFPWixLQUFLYSxnQkFBZ0IsQ0FBQ0MsY0FBYyxDQUFDRixLQUFLO2dCQUNqREcsYUFBYWYsS0FBS2EsZ0JBQWdCLENBQUNDLGNBQWMsQ0FBQ0MsV0FBVztZQUMvRDtZQUNBQyxjQUFjaEIsS0FBS2EsZ0JBQWdCLENBQUNHLFlBQVk7WUFDaERDLFFBQVFqQixLQUFLYSxnQkFBZ0IsQ0FBQ0ksTUFBTTtZQUNwQ0MsUUFBUWxCLEtBQUthLGdCQUFnQixDQUFDSyxNQUFNO1lBQ3BDQyxjQUFjbkIsS0FBS2EsZ0JBQWdCLENBQUNNLFlBQVk7WUFDaERDLGFBQ0VwQixLQUFLcUIsY0FBYyxJQUFJckIsS0FBS3FCLGNBQWMsQ0FBQ0MsTUFBTSxHQUFHLElBQ2hELENBQUMsa0NBQWtDLEVBQUV0QixLQUFLcUIsY0FBYyxDQUFDQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsR0FDbEY7WUFDTkMsUUFBUTtRQUNWO1FBRUE3QixPQUFPRyxPQUFPLENBQUMyQixJQUFJLENBQUNsQjtRQUVwQixNQUFNbUIsV0FBdUM7WUFBRW5CO1FBQU87UUFDdEQsT0FBT2QscURBQVlBLENBQUNTLElBQUksQ0FBQ3dCO0lBQzNCLEVBQUUsT0FBT0MsS0FBVTtRQUNqQixPQUFPLElBQUlsQyxxREFBWUEsQ0FBQyxDQUFDLE9BQU8sRUFBRWtDLEtBQUtDLFdBQVcsV0FBVyxFQUFFO1lBQUVKLFFBQVE7UUFBSTtJQUMvRTtBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvbWFjL1Byb2plY3RzL1NvbWEvZnJvbnRlbmQvYXBwL2FwaS9yZXBvcnRzL2dlbmVyYXRlL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiXG5pbXBvcnQgeyBuYW5vaWQgfSBmcm9tIFwibmFub2lkXCJcbmltcG9ydCB0eXBlIHsgR2VuZXJhdGVSZXBvcnRSZXF1ZXN0Qm9keSwgR2VuZXJhdGVSZXBvcnRSZXNwb25zZUJvZHksIFJlcG9ydCB9IGZyb20gXCJAL2xpYi90eXBlc1wiXG5cbi8vIEluLW1lbW9yeSBzdG9yZSBmb3IgZGVtb1xuY29uc3QgbWVtb3J5OiB7IHJlcG9ydHM6IFJlcG9ydFtdIH0gPSAoZ2xvYmFsIGFzIGFueSkuX19TT01BX1JFUE9SVFNfXyB8fCB7IHJlcG9ydHM6IFtdIH1cbjsoZ2xvYmFsIGFzIGFueSkuX19TT01BX1JFUE9SVFNfXyA9IG1lbW9yeVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5ID0gKGF3YWl0IHJlcS5qc29uKCkpIGFzIEdlbmVyYXRlUmVwb3J0UmVxdWVzdEJvZHlcblxuICAgIGNvbnN0IG5vd0lzbyA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIGNvbnN0IGlkID0gbmFub2lkKDEyKVxuXG4gICAgY29uc3QgcmVwb3J0OiBSZXBvcnQgPSB7XG4gICAgICBpZCxcbiAgICAgIHBhdGllbnRfc2Vzc2lvbl9pZDogYm9keS5zZXNzaW9uLnNlc3Npb25JZCxcbiAgICAgIGdlbmVyYXRlZF9hdDogbm93SXNvLFxuICAgICAgcHJlZGljdGVkOiB7XG4gICAgICAgIGxhYmVsOiBib2R5LnByZWRpY3RfcmVzcG9uc2UudG9wX3ByZWRpY3Rpb24ubGFiZWwsXG4gICAgICAgIHByb2JhYmlsaXR5OiBib2R5LnByZWRpY3RfcmVzcG9uc2UudG9wX3ByZWRpY3Rpb24ucHJvYmFiaWxpdHksXG4gICAgICB9LFxuICAgICAgZGlzdHJpYnV0aW9uOiBib2R5LnByZWRpY3RfcmVzcG9uc2UuZGlzdHJpYnV0aW9uLFxuICAgICAgdHJpYWdlOiBib2R5LnByZWRpY3RfcmVzcG9uc2UudHJpYWdlLFxuICAgICAgYWR2aWNlOiBib2R5LnByZWRpY3RfcmVzcG9uc2UuYWR2aWNlLFxuICAgICAgZXhwbGFuYXRpb25zOiBib2R5LnByZWRpY3RfcmVzcG9uc2UuZXhwbGFuYXRpb25zLFxuICAgICAgbGxtX3N1bW1hcnk6XG4gICAgICAgIGJvZHkucmVjZW50X3JlcG9ydHMgJiYgYm9keS5yZWNlbnRfcmVwb3J0cy5sZW5ndGggPiAwXG4gICAgICAgICAgPyBgQ29udGV4dC1hd2FyZSBzdW1tYXJ5IHJlZmVyZW5jaW5nICR7Ym9keS5yZWNlbnRfcmVwb3J0cy5sZW5ndGh9IHByaW9yIHJlcG9ydChzKS5gXG4gICAgICAgICAgOiBcIkNvbmNpc2UgY2xpbmljYWwgc3VtbWFyeSBiYXNlZCBvbiBjdXJyZW50IGlucHV0cy5cIixcbiAgICAgIHN0YXR1czogXCJwZW5kaW5nXCIsXG4gICAgfVxuXG4gICAgbWVtb3J5LnJlcG9ydHMucHVzaChyZXBvcnQpXG5cbiAgICBjb25zdCByZXNwb25zZTogR2VuZXJhdGVSZXBvcnRSZXNwb25zZUJvZHkgPSB7IHJlcG9ydCB9XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHJlc3BvbnNlKVxuICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgIHJldHVybiBuZXcgTmV4dFJlc3BvbnNlKGBFcnJvcjogJHtlcnI/Lm1lc3NhZ2UgPz8gXCJ1bmtub3duXCJ9YCwgeyBzdGF0dXM6IDQwMCB9KVxuICB9XG59XG5cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJuYW5vaWQiLCJtZW1vcnkiLCJnbG9iYWwiLCJfX1NPTUFfUkVQT1JUU19fIiwicmVwb3J0cyIsIlBPU1QiLCJyZXEiLCJib2R5IiwianNvbiIsIm5vd0lzbyIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsImlkIiwicmVwb3J0IiwicGF0aWVudF9zZXNzaW9uX2lkIiwic2Vzc2lvbiIsInNlc3Npb25JZCIsImdlbmVyYXRlZF9hdCIsInByZWRpY3RlZCIsImxhYmVsIiwicHJlZGljdF9yZXNwb25zZSIsInRvcF9wcmVkaWN0aW9uIiwicHJvYmFiaWxpdHkiLCJkaXN0cmlidXRpb24iLCJ0cmlhZ2UiLCJhZHZpY2UiLCJleHBsYW5hdGlvbnMiLCJsbG1fc3VtbWFyeSIsInJlY2VudF9yZXBvcnRzIiwibGVuZ3RoIiwic3RhdHVzIiwicHVzaCIsInJlc3BvbnNlIiwiZXJyIiwibWVzc2FnZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/reports/generate/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freports%2Fgenerate%2Froute&page=%2Fapi%2Freports%2Fgenerate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freports%2Fgenerate%2Froute.ts&appDir=%2FUsers%2Fmac%2FProjects%2FSoma%2Ffrontend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmac%2FProjects%2FSoma%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freports%2Fgenerate%2Froute&page=%2Fapi%2Freports%2Fgenerate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freports%2Fgenerate%2Froute.ts&appDir=%2FUsers%2Fmac%2FProjects%2FSoma%2Ffrontend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmac%2FProjects%2FSoma%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_mac_Projects_Soma_frontend_app_api_reports_generate_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/reports/generate/route.ts */ \"(rsc)/./app/api/reports/generate/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/reports/generate/route\",\n        pathname: \"/api/reports/generate\",\n        filename: \"route\",\n        bundlePath: \"app/api/reports/generate/route\"\n    },\n    resolvedPagePath: \"/Users/mac/Projects/Soma/frontend/app/api/reports/generate/route.ts\",\n    nextConfigOutput,\n    userland: _Users_mac_Projects_Soma_frontend_app_api_reports_generate_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZyZXBvcnRzJTJGZ2VuZXJhdGUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnJlcG9ydHMlMkZnZW5lcmF0ZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnJlcG9ydHMlMkZnZW5lcmF0ZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm1hYyUyRlByb2plY3RzJTJGU29tYSUyRmZyb250ZW5kJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRm1hYyUyRlByb2plY3RzJTJGU29tYSUyRmZyb250ZW5kJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNtQjtBQUNoRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL21hYy9Qcm9qZWN0cy9Tb21hL2Zyb250ZW5kL2FwcC9hcGkvcmVwb3J0cy9nZW5lcmF0ZS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvcmVwb3J0cy9nZW5lcmF0ZS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3JlcG9ydHMvZ2VuZXJhdGVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3JlcG9ydHMvZ2VuZXJhdGUvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvbWFjL1Byb2plY3RzL1NvbWEvZnJvbnRlbmQvYXBwL2FwaS9yZXBvcnRzL2dlbmVyYXRlL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freports%2Fgenerate%2Froute&page=%2Fapi%2Freports%2Fgenerate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freports%2Fgenerate%2Froute.ts&appDir=%2FUsers%2Fmac%2FProjects%2FSoma%2Ffrontend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmac%2FProjects%2FSoma%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:crypto");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/nanoid"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freports%2Fgenerate%2Froute&page=%2Fapi%2Freports%2Fgenerate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freports%2Fgenerate%2Froute.ts&appDir=%2FUsers%2Fmac%2FProjects%2FSoma%2Ffrontend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmac%2FProjects%2FSoma%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();